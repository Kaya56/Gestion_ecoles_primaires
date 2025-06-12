// repository/StaffRepository.java
package com.school.management.repository;

import com.school.management.entity.Staff;
import com.school.management.entity.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);
    List<Staff> findByDepartment(String department);
    List<Staff> findByPosition(String position);
    List<Staff> findByRole(UserRole role);

    // Méthode pour la recherche avec pagination
    Page<Staff> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName, Pageable pageable);
}