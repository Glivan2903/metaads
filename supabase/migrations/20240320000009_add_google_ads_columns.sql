-- Adiciona colunas para integração com Google Ads
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_ads_client_id TEXT,
ADD COLUMN IF NOT EXISTS google_ads_client_secret TEXT,
ADD COLUMN IF NOT EXISTS google_ads_developer_token TEXT,
ADD COLUMN IF NOT EXISTS google_ads_login_customer_id TEXT,
ADD COLUMN IF NOT EXISTS google_ads_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_ads_access_token TEXT,
ADD COLUMN IF NOT EXISTS google_ads_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Comentários para documentação
COMMENT ON COLUMN users.google_ads_client_id IS 'Client ID do Google Cloud Console para autenticação OAuth2';
COMMENT ON COLUMN users.google_ads_client_secret IS 'Client Secret do Google Cloud Console para autenticação OAuth2';
COMMENT ON COLUMN users.google_ads_developer_token IS 'Token de desenvolvedor do Google Ads para autenticação na API';
COMMENT ON COLUMN users.google_ads_login_customer_id IS 'ID da conta Google Ads (sem hífens) usada para autenticação';
COMMENT ON COLUMN users.google_ads_refresh_token IS 'Token de atualização OAuth2 do Google Ads';
COMMENT ON COLUMN users.google_ads_access_token IS 'Token de acesso OAuth2 do Google Ads';
COMMENT ON COLUMN users.google_ads_token_expires_at IS 'Data e hora de expiração do token de acesso'; 