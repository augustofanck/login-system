package com.augusto.login_system.user;

import com.augusto.login_system.auth.dto.RegisterRequest;
import com.augusto.login_system.common.DuplicateDataException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public void register(RegisterRequest req) {
        if (repo.existsByEmail(req.email())) throw new DuplicateDataException("E-mail já cadastrado");
        if (repo.existsByCpf(req.cpf())) throw new DuplicateDataException("CPF já cadastrado");

        var u = new User();
        u.setName(req.name());
        u.setEmail(req.email().toLowerCase());
        u.setCpf(req.cpf());
        u.setRole(req.role());
        u.setPasswordHash(encoder.encode(req.password()));
        repo.save(u);
    }
}