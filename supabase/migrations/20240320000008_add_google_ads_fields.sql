-- Adiciona campos para integração com Google Ads
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_ads_developer_token TEXT,
ADD COLUMN IF NOT EXISTS google_ads_login_customer_id TEXT;

-- Comentários para documentação
COMMENT ON COLUMN users.google_ads_developer_token IS 'Token de desenvolvedor do Google Ads para autenticação na API';
COMMENT ON COLUMN users.google_ads_login_customer_id IS 'ID da conta Google Ads (sem hífens) usada para autenticação'; 