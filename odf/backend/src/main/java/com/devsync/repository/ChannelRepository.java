package com.devsync.repository;

import com.devsync.model.Channel;
import com.devsync.model.Workspace;
import com.devsync.model.User;
import com.devsync.model.ChannelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    List<Channel> findByWorkspaceAndArchivedFalse(Workspace workspace);
    
    @Query("SELECT c FROM Channel c JOIN c.members m WHERE m = ?1 AND c.archived = false")
    List<Channel> findByMemberAndArchivedFalse(User user);
    
    @Query("SELECT c FROM Channel c WHERE c.workspace = ?1 AND c.type = ?2 AND c.archived = false")
    List<Channel> findByWorkspaceAndType(Workspace workspace, ChannelType type);
    
    @Query("SELECT c FROM Channel c WHERE c.name LIKE %?1% AND c.workspace = ?2")
    List<Channel> searchByNameInWorkspace(String name, Workspace workspace);
}