package com.augusto.login_system.common;

import com.augusto.login_system.user.Role;
import com.augusto.login_system.user.User;
import com.augusto.login_system.user.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;

@Profile("dev")
@Component
public class DevDataSeeder implements CommandLineRunner {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public DevDataSeeder(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        ensureUser("Admin", "admin@local.dev", "12345678901", "Admin@123", Role.ADMIN);
        ensureUser("User", "user@local.dev", "12345678902", "User@123", Role.USER);
    }

    private void ensureUser(String name, String email, String cpf, String rawPassword, Role role) {
        String normalizedEmail = EmailNormalizer.normalize(email);

        if (repo.existsByEmail(normalizedEmail)) return;

        User u = new User();
        u.setName(name);
        u.setEmail(normalizedEmail);
        u.setCpf(cpf);
        u.setRole(role);
        u.setPasswordHash(encoder.encode(rawPassword));
        repo.save(u);
    }
}
