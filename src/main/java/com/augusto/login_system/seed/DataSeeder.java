package com.augusto.login_system.seed;

import com.augusto.login_system.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByEmail("admin@local.dev")) {
                var admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@local.dev");
                admin.setCpf("00000000000");
                admin.setRole(Role.ADMIN);
                admin.setPasswordHash(encoder.encode("Admin@123"));
                repo.save(admin);
            }

            if (!repo.existsByEmail("user@local.dev")) {
                var user = new User();
                user.setName("User");
                user.setEmail("user@local.dev");
                user.setCpf("11111111111");
                user.setRole(Role.USER);
                user.setPasswordHash(encoder.encode("User@123"));
                repo.save(user);
            }
        };
    }
}