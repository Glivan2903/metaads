-- Add is_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Insert admin user if not exists
INSERT INTO users (id, email, full_name, role, is_active)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'conectajuse@gmail.com'),
    'conectajuse@gmail.com',
    'Administrador',
    'admin',
    true
)
ON CONFLICT (email) DO UPDATE
SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active; 