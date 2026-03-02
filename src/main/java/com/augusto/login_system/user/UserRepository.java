package com.augusto.login_system.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<User> findByEmail(String email);
}
