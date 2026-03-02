package com.augusto.login_system.admin;

import com.augusto.login_system.admin.dto.UserListItem;
import com.augusto.login_system.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.augusto.login_system.common.NotFoundException;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
public class AdminUsersController {

    private final UserRepository repo;

    public AdminUsersController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        var items = repo.findAll().stream()
                .map(u -> new UserListItem(u.getId(), u.getName(), u.getEmail(), u.getCpf(), u.getRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        var meEmail = auth.getName();

        var target = repo.findById(id).orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (target.getEmail().equalsIgnoreCase(meEmail)) {
            throw new IllegalArgumentException("Você não pode excluir a si mesmo");
        }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}