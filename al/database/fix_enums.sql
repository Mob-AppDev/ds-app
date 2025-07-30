-- Fix enum type issues by updating the database to handle enum types properly
-- This script should be run as the postgres superuser

-- Grant necessary permissions to devsync user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devsync;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devsync;

-- Create a function to safely cast enum to text
CREATE OR REPLACE FUNCTION cast_enum_to_text(enum_value anyenum)
RETURNS text AS $$
BEGIN
    RETURN enum_value::text;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update the users table to handle status enum properly
ALTER TABLE users ALTER COLUMN status TYPE text USING status::text;

-- Update the roles table to handle name enum properly  
ALTER TABLE roles ALTER COLUMN name TYPE text USING name::text;

-- Update the messages table to handle type enum properly
ALTER TABLE messages ALTER COLUMN type TYPE text USING type::text;

-- Drop the enum types (optional)
-- DROP TYPE IF EXISTS user_status;
-- DROP TYPE IF EXISTS role_name;
-- DROP TYPE IF EXISTS message_type;