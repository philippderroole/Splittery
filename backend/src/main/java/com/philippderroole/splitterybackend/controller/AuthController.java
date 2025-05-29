package com.philippderroole.splitterybackend.controller;

import com.philippderroole.splitterybackend.dtos.auth.AnonymousDto;
import com.philippderroole.splitterybackend.dtos.auth.JwtTokenDto;
import com.philippderroole.splitterybackend.dtos.auth.LoginDto;
import com.philippderroole.splitterybackend.dtos.auth.RegisterDto;
import com.philippderroole.splitterybackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtTokenDto> login(@RequestBody LoginDto loginDto) {
        try {
            String token = authService.login(loginDto);
            JwtTokenDto jwtTokenDto = JwtTokenDto.of(token);

            return new ResponseEntity<>(jwtTokenDto, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<JwtTokenDto> register(@RequestBody RegisterDto registerDto) {
        try {
            String token = authService.register(registerDto);
            JwtTokenDto jwtTokenDto = JwtTokenDto.of(token);

            return new ResponseEntity<>(jwtTokenDto, CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping("/anonymous")
    public ResponseEntity<JwtTokenDto> anonymous(@RequestBody AnonymousDto anonymousDto) {
        try {
            String token = authService.register(anonymousDto);
            JwtTokenDto jwtTokenDto = JwtTokenDto.of(token);

            return new ResponseEntity<>(jwtTokenDto, CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        try {
            authService.logout();

            return new ResponseEntity<>(OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}