    // repository/TeacherRepository.java
    package com.school.management.repository;

    import com.school.management.entity.Teacher;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;
    import java.util.Optional;

    @Repository
    public interface TeacherRepository extends JpaRepository<Teacher, Long> {

        Optional<Teacher> findByEmail(String email);

        @Query("SELECT t FROM Teacher t WHERE " +
                "LOWER(t.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                "LOWER(t.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                "LOWER(t.specialization) LIKE LOWER(CONCAT('%', :search, '%'))")
        List<Teacher> findBySearch(@Param("search") String search);

        List<Teacher> findBySpecialization(String specialization);
    }
