package com.augusto.login_system.user;

import com.augusto.login_system.auth.dto.RegisterRequest;
import com.augusto.login_system.common.DuplicateDataException;
import com.augusto.login_system.common.EmailNormalizer;
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
        String email = EmailNormalizer.normalize(req.email());

        if (repo.existsByEmail(email)) {
            throw new DuplicateDataException("E-mail já cadastrado");
        }
        if (repo.existsByCpf(req.cpf())) {
            throw new DuplicateDataException("CPF já cadastrado");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(email);
        user.setCpf(req.cpf());
        user.setRole(req.role());
        user.setPasswordHash(encoder.encode(req.password()));

        repo.save(user);
    }
}
