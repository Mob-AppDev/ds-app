package com.devsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * DevSync Application - Unified Slack Clone
 * 
 * Main application class that bootstraps the Spring Boot application.
 * This unified codebase combines the best features from multiple implementations:
 * - Core messaging functionality from ODF implementation
 * - Advanced UI components from AL and Mike implementations
 * - Real-time communication and collaboration features
 */
@SpringBootApplication
public class DevSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevSyncApplication.class, args);
    }
}