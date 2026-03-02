package com.augusto.login_system.user;

import com.augusto.login_system.common.EmailNormalizer;
import com.augusto.login_system.user.dto.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MeService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public MeService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User me(String email) {
        String normalized = EmailNormalizer.normalize(email);
        return repo.findByEmail(normalized).orElseThrow();
    }

    public void changePassword(String email, ChangePasswordRequest req) {
        if (!req.newPassword().equals(req.confirmNewPassword())) {
            throw new IllegalArgumentException("Confirmação de senha não confere");
        }

        String normalized = EmailNormalizer.normalize(email);

        var user = repo.findByEmail(normalized).orElseThrow();

        if (!encoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Senha atual inválida");
        }

        user.setPasswordHash(encoder.encode(req.newPassword()));
        repo.save(user);
    }
}
