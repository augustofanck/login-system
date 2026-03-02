package com.augusto.login_system.admin.dto;

import com.augusto.login_system.user.Role;

public record UserListItem(Long id, String name, String email, String cpf, Role role) {}