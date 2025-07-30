-- Migration script to convert enum columns to VARCHAR
-- Run this script to fix the type mismatch between Hibernate and PostgreSQL enums

-- Update users table status column
ALTER TABLE users 
ALTER COLUMN status TYPE VARCHAR(20) USING status::VARCHAR(20);

-- Update roles table name column  
ALTER TABLE roles 
ALTER COLUMN name TYPE VARCHAR(20) USING name::VARCHAR(20);

-- Update messages table type column
ALTER TABLE messages 
ALTER COLUMN type TYPE VARCHAR(20) USING type::VARCHAR(20);

-- Drop the enum types (optional - only if you want to clean up)
-- DROP TYPE IF EXISTS user_status;
-- DROP TYPE IF EXISTS role_name; 
-- DROP TYPE IF EXISTS message_type;