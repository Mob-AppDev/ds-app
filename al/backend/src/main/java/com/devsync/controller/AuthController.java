package com.devsync.controller;

import com.devsync.entity.ERole;
import com.devsync.entity.Role;
import com.devsync.entity.User;
import com.devsync.entity.UserStatus;
import com.devsync.payload.request.LoginRequest;
import com.devsync.payload.request.SignupRequest;
import com.devsync.payload.response.JwtResponse;
import com.devsync.payload.response.MessageResponse;
import com.devsync.repository.RoleRepository;
import com.devsync.repository.UserRepository;
import com.devsync.security.UserDetailsImpl;
import com.devsync.utils.JwtUtils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    private void logAuthenticationAttempt(String username, String details) {
        logger.info("=== AUTHENTICATION ATTEMPT ===");
        logger.info("Username: {}", username);
        logger.info("Timestamp: {}", java.time.LocalDateTime.now());
        logger.info("Details: {}", details);
        logger.info("===============================");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logAuthenticationAttempt(loginRequest.getUsername(), "Login attempt started");
        
        // Check if username exists first
        if (!userRepository.existsByUsername(loginRequest.getUsername())) {
            logAuthenticationAttempt(loginRequest.getUsername(), "FAILED - Username does not exist");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Username does not exist"));
        }
        
        // Get user details for additional debugging info
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (user != null) {
            logAuthenticationAttempt(loginRequest.getUsername(), 
                String.format("User found - ID: %d, Status: %s, Created: %s", 
                    user.getId(), user.getStatus(), user.getCreatedAt()));
            
            // DEBUG: Log the password hash from database and test manual verification
            logger.info("=== PASSWORD DEBUG ===");
            logger.info("Input password: {}", loginRequest.getPassword());
            logger.info("Stored hash: {}", user.getPassword());
            logger.info("Manual BCrypt match: {}", encoder.matches(loginRequest.getPassword(), user.getPassword()));
            logger.info("=====================");
        }
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            logAuthenticationAttempt(loginRequest.getUsername(), "SUCCESS - Authentication completed");
            
            return ResponseEntity.ok(new JwtResponse(jwt,
                                                     userDetails.getId(),
                                                     userDetails.getUsername(),
                                                     userDetails.getEmail(),
                                                     roles));
        } catch (BadCredentialsException e) {
            logAuthenticationAttempt(loginRequest.getUsername(), "FAILED - Bad credentials (User ID: " + (user != null ? user.getId() : "unknown") + ")");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid password"));
        } catch (DisabledException e) {
            logAuthenticationAttempt(loginRequest.getUsername(), "FAILED - Account disabled");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Account is disabled"));
        } catch (LockedException e) {
            logAuthenticationAttempt(loginRequest.getUsername(), "FAILED - Account locked");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Account is locked"));
        } catch (Exception e) {
            logAuthenticationAttempt(loginRequest.getUsername(), "FAILED - Unexpected error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        logger.info("=== SIGNUP REQUEST RECEIVED ===");
        logger.info("Request body: {}", signUpRequest);
        logger.info("Username: {}", signUpRequest.getUsername());
        logger.info("Email: {}", signUpRequest.getEmail());
        logger.info("Password length: {}", signUpRequest.getPassword() != null ? signUpRequest.getPassword().length() : "null");
        logger.info("Role: {}", signUpRequest.getRole());
        logger.info("===============================");
        
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        
        // Explicitly set the status to ensure proper enum handling
        user.setStatus(UserStatus.ACTIVE);

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("User signed out successfully!"));
    }

    @PostMapping("/reset-admin-password")
    public ResponseEntity<?> resetAdminPassword() {
        try {
            User adminUser = userRepository.findByUsername("admin").orElse(null);
            if (adminUser != null) {
                // Reset admin password to 'password123'
                adminUser.setPassword(encoder.encode("password123"));
                userRepository.save(adminUser);
                
                logger.info("Admin password reset successfully");
                return ResponseEntity.ok(new MessageResponse("Admin password reset to 'password123'"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Admin user not found"));
            }
        } catch (Exception e) {
            logger.error("Error resetting admin password: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error resetting password: " + e.getMessage()));
        }
    }
}