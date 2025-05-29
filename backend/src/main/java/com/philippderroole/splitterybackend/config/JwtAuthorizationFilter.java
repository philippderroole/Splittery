package com.philippderroole.splitterybackend.config;

import com.philippderroole.splitterybackend.entities.User;
import com.philippderroole.splitterybackend.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Date;

import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static java.time.Instant.EPOCH;
import static java.util.Optional.ofNullable;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    public static final Instant EXPIRATION_TIME = Instant.now().plusSeconds(3600);

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            User user = userRepository.findById(jwtAuthenticationToken.getName()).orElse(null);

            if (user == null) {
                response.setStatus(SC_UNAUTHORIZED);
                return;
            }

            Date now = new Date();
            Date expirationDate = Date.from(
                    ofNullable(jwtAuthenticationToken.getToken().getExpiresAt())
                            .orElse(EXPIRATION_TIME));

            if (expirationDate.before(now)) {
                response.setStatus(SC_UNAUTHORIZED);
                return;
            }

            Date issueDate = Date.from(
                    ofNullable(jwtAuthenticationToken.getToken().getIssuedAt())
                            .orElse(EPOCH));

            if (issueDate.after(Date.from(EXPIRATION_TIME))) {
                response.setStatus(SC_UNAUTHORIZED);
                return;
            }

            Date lastLogout = user.getLastLogout();

            if (lastLogout.after(issueDate)) {
                response.setStatus(SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}