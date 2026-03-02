package com.augusto.login_system.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name="uk_users_email", columnNames="email"),
                @UniqueConstraint(name="uk_users_cpf", columnNames="cpf")
        })
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String name;

    @Column(nullable=false)
    private String email;

    @Column(nullable=false, length=11)
    private String cpf;

    @Column(nullable=false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Role role;

    @Column(nullable=false, updatable=false)
    private Instant createdAt = Instant.now();

    @Column(nullable=false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() { this.updatedAt = Instant.now(); }
}