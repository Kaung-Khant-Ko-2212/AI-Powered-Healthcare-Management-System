
package com.ezhealthcare.EZHealthcare.repository;

import com.ezhealthcare.EZHealthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    void deleteById(Long userId);

    int countByGender(String male);
}