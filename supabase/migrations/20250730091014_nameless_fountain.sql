-- DevSync Database Schema - Unified Implementation
-- Combines the best database design from all implementations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Enhanced from ODF implementation)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    profile_photo VARCHAR(255),
    status VARCHAR(20) DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE')),
    last_seen TIMESTAMP,
    fcm_token VARCHAR(255), -- For push notifications
    provider VARCHAR(50), -- OAuth2 provider (google, github, etc.)
    provider_id VARCHAR(100), -- OAuth2 provider user ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table (From AL implementation)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL CHECK (name IN ('ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'))
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Channels table (Enhanced from ODF implementation)
CREATE TABLE channels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    topic VARCHAR(200),
    type VARCHAR(20) DEFAULT 'PUBLIC' CHECK (type IN ('PUBLIC', 'PRIVATE', 'DIRECT_MESSAGE')),
    archived BOOLEAN DEFAULT FALSE,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Channel members junction table
CREATE TABLE channel_members (
    channel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP,
    PRIMARY KEY (channel_id, user_id),
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table (Enhanced from ODF implementation)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'TEXT' CHECK (type IN ('TEXT', 'IMAGE', 'FILE', 'SYSTEM')),
    sender_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    parent_message_id BIGINT,
    edited BOOLEAN DEFAULT FALSE,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Message reactions table
CREATE TABLE message_reactions (
    id BIGSERIAL PRIMARY KEY,
    emoji VARCHAR(10) NOT NULL,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attachments table
CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    message_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Canvas tables (From Mike implementation)
CREATE TABLE canvases (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    starred BOOLEAN DEFAULT FALSE,
    template VARCHAR(100),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE canvas_blocks (
    id BIGSERIAL PRIMARY KEY,
    canvas_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT,
    position_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE
);

CREATE TABLE canvas_comments (
    id BIGSERIAL PRIMARY KEY,
    canvas_id BIGINT NOT NULL,
    block_id BIGINT,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
    FOREIGN KEY (block_id) REFERENCES canvas_blocks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lists tables (From Mike implementation)
CREATE TABLE lists (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template VARCHAR(100),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE list_items (
    id BIGSERIAL PRIMARY KEY,
    list_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee VARCHAR(100),
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(50) DEFAULT 'To Do',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User sessions table
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info VARCHAR(500),
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- External connections table (From Mike implementation)
CREATE TABLE external_connections (
    id BIGSERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    connection_type VARCHAR(50) DEFAULT 'active' CHECK (connection_type IN ('active', 'pending', 'request')),
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_channel_members_user ON channel_members(user_id);
CREATE INDEX idx_channel_members_channel ON channel_members(channel_id);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);
CREATE INDEX idx_message_reactions_message ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user ON message_reactions(user_id);
CREATE INDEX idx_attachments_message ON attachments(message_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_canvas_blocks_canvas ON canvas_blocks(canvas_id);
CREATE INDEX idx_canvas_comments_canvas ON canvas_comments(canvas_id);
CREATE INDEX idx_list_items_list ON list_items(list_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canvases_updated_at BEFORE UPDATE ON canvases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_list_items_updated_at BEFORE UPDATE ON list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO roles (name) VALUES 
('ROLE_USER'),
('ROLE_MODERATOR'),
('ROLE_ADMIN');

-- Insert sample data for development
INSERT INTO users (name, email, password, status) VALUES 
('DevSync Admin', 'admin@devsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ONLINE'),
('Caleb Adams', 'caleb@devsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ONLINE'),
('Michael Oti Yamoah', 'michael@devsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'AWAY'),
('Hakeem Adam', 'hakeem@devsync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ONLINE');

-- Assign default role to users
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE r.name = 'ROLE_USER';

-- Make first user admin
INSERT INTO user_roles (user_id, role_id) 
SELECT 1, r.id FROM roles r WHERE r.name = 'ROLE_ADMIN';

-- Insert sample channels
INSERT INTO channels (name, description, type, created_by) VALUES 
('general', 'General discussions for the team', 'PUBLIC', 1),
('announcements', 'Important announcements and updates', 'PUBLIC', 1),
('development', 'Development discussions and code reviews', 'PUBLIC', 1),
('design', 'Design discussions and feedback', 'PUBLIC', 1),
('random', 'Random conversations and fun stuff', 'PUBLIC', 1);

-- Add all users to general channels
INSERT INTO channel_members (channel_id, user_id) 
SELECT c.id, u.id FROM channels c, users u WHERE c.name IN ('general', 'announcements');

-- Insert sample messages
INSERT INTO messages (content, sender_id, channel_id) VALUES 
('Welcome to DevSync! 🎉 This is where our team collaboration begins.', 1, 1),
('Thanks for setting up this amazing workspace!', 2, 1),
('Looking forward to working with everyone here.', 3, 1),
('Let''s build something incredible together! 🚀', 4, 1);

-- Insert sample canvas
INSERT INTO canvases (title, created_by, template) VALUES 
('Team Onboarding Guide', 1, 'Project Brief'),
('Sprint Planning Canvas', 2, 'Sprint Planning'),
('Design System Documentation', 3, 'Design System');

-- Insert sample lists
INSERT INTO lists (title, created_by, template) VALUES 
('Development Tasks', 1, 'To-Dos'),
('Project Roadmap', 2, 'Project Plan'),
('Team Goals', 3, 'To-Dos');

-- Insert sample list items
INSERT INTO list_items (list_id, title, description, assignee, due_date, priority, status) VALUES 
(1, 'Setup development environment', 'Configure local development setup for new team members', 'Caleb Adams', '2024-02-15', 'high', 'In Progress'),
(1, 'Code review process', 'Establish code review guidelines and workflow', 'Michael Oti Yamoah', '2024-02-20', 'medium', 'To Do'),
(1, 'Testing framework', 'Implement automated testing framework', 'Hakeem Adam', '2024-02-25', 'high', 'To Do'),
(2, 'Q1 Feature Planning', 'Plan and prioritize features for Q1 release', 'DevSync Admin', '2024-03-01', 'high', 'In Progress'),
(2, 'User Research', 'Conduct user interviews and gather feedback', 'Caleb Adams', '2024-02-28', 'medium', 'To Do');