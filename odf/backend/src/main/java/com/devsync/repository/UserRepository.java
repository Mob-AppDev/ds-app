package com.devsync.repository;

import com.devsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUsers(String query);
    
    @Query("SELECT u FROM User u WHERE u.id IN ?1")
    List<User> findByIds(List<Long> ids);
}