package com.augusto.login_system.auth.dto;

import com.augusto.login_system.user.Role;
import com.augusto.login_system.validation.ValidCpf;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min=8, message = "Sua senha deve conter 8 ou mais caracteres") String password,
        @NotBlank @ValidCpf String cpf,
        @NotNull Role role
) {}