package com.augusto.login_system.admin;

import com.augusto.login_system.admin.dto.UserListItem;
import com.augusto.login_system.common.NotFoundException;
import com.augusto.login_system.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
public class AdminUsersController {

    private final UserRepository repo;

    public AdminUsersController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<Page<UserListItem>> list(Pageable pageable) {
        var page = repo.findAll(pageable)
                .map(u -> new UserListItem(u.getId(), u.getName(), u.getEmail(), u.getCpf(), u.getRole()));

        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        String meEmail = auth.getName();

        var target = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (target.getEmail().equalsIgnoreCase(meEmail)) {
            throw new IllegalArgumentException("Você não pode excluir a si mesmo");
        }

        repo.delete(target);
        return ResponseEntity.noContent().build();
    }
}
