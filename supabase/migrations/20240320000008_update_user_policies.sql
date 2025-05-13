-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins can see all users" ON users;
DROP POLICY IF EXISTS "Users can see only themselves" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can update only themselves" ON users;

-- Criar novas políticas
-- Política para visualização de usuários
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para inserção de usuários (apenas admins)
CREATE POLICY "Enable insert for admins" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Política para atualização de usuários
CREATE POLICY "Enable update for admins" ON users
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Política para deleção de usuários (apenas admins)
CREATE POLICY "Enable delete for admins" ON users
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    ); 