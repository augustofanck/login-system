package com.augusto.login_system.auth.dto;

import com.augusto.login_system.user.Role;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min=8) String password,
        @NotBlank @Pattern(regexp="\\d{11}", message="CPF deve ter 11 dígitos") String cpf,
        @NotNull Role role
) {}