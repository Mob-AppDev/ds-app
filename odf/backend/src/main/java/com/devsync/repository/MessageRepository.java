package com.devsync.repository;

import com.devsync.model.Message;
import com.devsync.model.Channel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByChannelOrderByCreatedAtDesc(Channel channel, Pageable pageable);
    
    List<Message> findByParentMessage(Message parentMessage);
    
    @Query("SELECT m FROM Message m WHERE m.channel = ?1 AND m.content LIKE %?2%")
    List<Message> searchInChannel(Channel channel, String query);
    
    @Query("SELECT m FROM Message m WHERE m.channel = ?1 AND m.pinned = true")
    List<Message> findPinnedMessages(Channel channel);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.channel = ?1 AND m.createdAt > ?2")
    Long countUnreadMessages(Channel channel, java.time.LocalDateTime lastRead);
}