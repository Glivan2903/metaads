-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable last_login update" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Only admins can insert users" ON users;
DROP POLICY IF EXISTS "Only admins can delete users" ON users;
DROP POLICY IF EXISTS "Admins can see all users" ON users;
DROP POLICY IF EXISTS "Users can see only themselves" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can update only themselves" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;

-- Desabilitar RLS completamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY; 