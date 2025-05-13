-- Primeiro, vamos remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update only themselves" ON users;
DROP POLICY IF EXISTS "Only admins can insert users" ON users;
DROP POLICY IF EXISTS "Only admins can delete users" ON users;

-- Desabilitar RLS temporariamente para permitir operações iniciais
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Criar uma política simples para SELECT
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Criar uma política simples para UPDATE
CREATE POLICY "Enable update for users based on id" ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- Habilitar RLS novamente
ALTER TABLE users ENABLE ROW LEVEL SECURITY; 