-- Remover a tabela users existente
DROP TABLE IF EXISTS users CASCADE;

-- Criar a tabela users novamente com a estrutura correta
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    google_ads_client_id TEXT,
    google_ads_client_secret TEXT,
    google_ads_refresh_token TEXT,
    google_ads_access_token TEXT,
    google_ads_token_expires_at TIMESTAMP WITH TIME ZONE
);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Desabilitar RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Inserir usuário admin
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