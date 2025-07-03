package com.philippderroole.splitterybackend.service;


import com.philippderroole.splitterybackend.dtos.auth.AnonymousDto;
import com.philippderroole.splitterybackend.dtos.auth.LoginDto;
import com.philippderroole.splitterybackend.dtos.auth.RegisterDto;
import com.philippderroole.splitterybackend.entities.User;
import com.philippderroole.splitterybackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public final class AuthService {
    @Autowired
    JwtEncoder jwtEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user and generates a JWT token.
     *
     * @return A JWT token for the authenticated user.
     */
    public String login(LoginDto loginDto) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginDto.getEmail(), loginDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationRequest);
        loginDto.setPassword(null);

        return generateToken(authentication);
    }

    /**
     * Registers a new anonymous user.
     *
     * @return A JWT token for the anonymous user.
     */
    public String register(AnonymousDto anonymousDto) {
        User user = new User();
        user.setUsername(anonymousDto.getName());
        user.setAnonymous(true);
        user = userRepository.save(user);

        // Anonymous users can't log in with a password
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getId(),
                ""
        );

        return generateToken(authentication);
    }

    /**
     * Converts an anonymous user to a registered user.
     *
     * @param registerDto The registration data transfer object containing user details.
     * @return A JWT token for the registered user.
     */
    public String register(RegisterDto registerDto) {
        String passwordHash = passwordEncoder.encode(registerDto.getPassword());
        registerDto.setPassword(null);

        Authentication previousAuthentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findById(previousAuthentication.getName())
                .filter(User::isAnonymous)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepository.findByEmail(registerDto.getEmail()).ifPresent(user1 -> {
            throw new IllegalArgumentException("Email already in use");
        });

        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordHash);
        user.setAnonymous(false);
        user = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getId(),
                user.getPassword()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return generateToken(authentication);
    }

    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Date now = new Date();
        user.setLastLogout(now);
        userRepository.save(user);

        SecurityContextHolder.clearContext();
    }

    /**
     * Generates a JWT token for the given authentication.
     *
     * @param authentication The authentication object.
     * @return The generated JWT token.
     */
    private String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        long expiry = 36000L;
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}