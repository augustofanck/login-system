package com.augusto.login_system.user;

import com.augusto.login_system.user.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping
    public ResponseEntity<MeResponse> me(Authentication auth) {
        var user = meService.me(auth.getName()); // devolve sem passwordHash
        return ResponseEntity.ok(new MeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCpf(),
                user.getRole()
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication auth, @Valid @RequestBody ChangePasswordRequest req) {
        meService.changePassword(auth.getName(), req);
        return ResponseEntity.ok().build();
    }

    public record MeResponse(Long id, String name, String email, String cpf, Role role) {}
}
