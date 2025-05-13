-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Only admins can insert users" ON users;
DROP POLICY IF EXISTS "Only admins can delete users" ON users;

-- Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Criar uma política simples para SELECT
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Criar uma política específica para atualização do último login
CREATE POLICY "Enable last_login update" ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        (NEW.last_login IS NOT NULL AND OLD.last_login IS DISTINCT FROM NEW.last_login) OR
        (NEW.google_ads_client_id IS NOT NULL AND OLD.google_ads_client_id IS DISTINCT FROM NEW.google_ads_client_id) OR
        (NEW.google_ads_client_secret IS NOT NULL AND OLD.google_ads_client_secret IS DISTINCT FROM NEW.google_ads_client_secret) OR
        (NEW.google_ads_refresh_token IS NOT NULL AND OLD.google_ads_refresh_token IS DISTINCT FROM NEW.google_ads_refresh_token) OR
        (NEW.google_ads_access_token IS NOT NULL AND OLD.google_ads_access_token IS DISTINCT FROM NEW.google_ads_access_token) OR
        (NEW.google_ads_token_expires_at IS NOT NULL AND OLD.google_ads_token_expires_at IS DISTINCT FROM NEW.google_ads_token_expires_at)
    );

-- Habilitar RLS novamente
ALTER TABLE users ENABLE ROW LEVEL SECURITY; 