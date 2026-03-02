package com.augusto.login_system.auth;

import com.augusto.login_system.auth.dto.*;
import com.augusto.login_system.security.JwtService;
import com.augusto.login_system.user.UserRepository;
import com.augusto.login_system.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepo;

    public AuthController(UserService userService, AuthenticationManager authManager, JwtService jwtService, UserRepository userRepo) {
        this.userService = userService;
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest req) {
        userService.register(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        var user = userRepo.findByEmail(req.email().toLowerCase()).orElseThrow();
        var token = jwtService.generate(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(token));
    }
}