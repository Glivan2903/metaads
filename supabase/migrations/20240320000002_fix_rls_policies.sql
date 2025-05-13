-- Primeiro, vamos remover as políticas existentes
DROP POLICY IF EXISTS "Admins can see all users" ON users;
DROP POLICY IF EXISTS "Users can see only themselves" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Users can update only themselves" ON users;

-- Agora vamos criar as novas políticas corrigidas
-- Política para visualização: todos os usuários autenticados podem ver todos os usuários
CREATE POLICY "Users can view all users" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Política para atualização: usuários só podem atualizar seus próprios dados
CREATE POLICY "Users can update only themselves" ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- Política para inserção: apenas administradores podem inserir novos usuários
CREATE POLICY "Only admins can insert users" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Política para deleção: apenas administradores podem deletar usuários
CREATE POLICY "Only admins can delete users" ON users
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    ); 