// repository/UserRepository.java
package com.school.management.repository;

import com.school.management.entity.User;
import com.school.management.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(UserRole role);
    List<User> findByActive(Boolean active);

    // Méthodes ajoutées (manquantes)
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
