package com.devsync.repository;

import com.devsync.model.Workspace;
import com.devsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    @Query("SELECT w FROM Workspace w JOIN w.members m WHERE m = ?1")
    List<Workspace> findByMember(User user);
    
    List<Workspace> findByOwner(User owner);
    
    @Query("SELECT w FROM Workspace w WHERE w.name LIKE %?1%")
    List<Workspace> searchByName(String name);
}