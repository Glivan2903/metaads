import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Info, Copy, Check } from "lucide-react";

interface GoogleAdsCredentials {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  loginCustomerId: string;
  redirectUri: string;
}

export function GoogleAdsApiIntegration() {
  const { user, updateUser } = useAuth();
  const [credentials, setCredentials] = useState<GoogleAdsCredentials>(() => ({
    clientId: user?.google_ads_client_id || "",
    clientSecret: user?.google_ads_client_secret || "",
    developerToken: user?.google_ads_developer_token || "",
    loginCustomerId: user?.google_ads_login_customer_id || "",
    redirectUri: window.location.origin + "/oauth-callback"
  }));
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return !!user?.google_ads_access_token;
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCredentials = async () => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      // Validate credentials
      if (!credentials.clientId || !credentials.clientSecret || !credentials.developerToken || !credentials.loginCustomerId) {
        toast.error("Todos os campos são obrigatórios");
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          google_ads_client_id: credentials.clientId,
          google_ads_client_secret: credentials.clientSecret,
          google_ads_developer_token: credentials.developerToken,
          google_ads_login_customer_id: credentials.loginCustomerId,
        })
        .eq('id', user.id);

      if (error) throw error;

      await updateUser();
      toast.success("Credenciais salvas com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
      toast.error("Erro ao salvar credenciais");
    }
  };

  const handleConnect = () => {
    if (!credentials.clientId || !credentials.clientSecret || !credentials.developerToken || !credentials.loginCustomerId) {
      toast.error("Configure todas as credenciais antes de conectar");
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${credentials.clientId}&response_type=code&scope=https://www.googleapis.com/auth/adwords&redirect_uri=${encodeURIComponent(credentials.redirectUri)}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('users')
        .update({
          google_ads_client_id: null,
          google_ads_client_secret: null,
          google_ads_developer_token: null,
          google_ads_login_customer_id: null,
          google_ads_refresh_token: null,
          google_ads_access_token: null,
          google_ads_token_expires_at: null,
        })
        .eq('id', user.id);

      if (error) throw error;

      await updateUser();
      setIsConnected(false);
      toast.info("Desconectado da API do Google Ads");
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast.error("Erro ao desconectar da API do Google Ads");
    }
  };

  const handleCopyUri = async () => {
    try {
      await navigator.clipboard.writeText(credentials.redirectUri);
      setCopied(true);
      toast.success("URI copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar URI:', error);
      toast.error("Erro ao copiar URI");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração com Google Ads API</CardTitle>
        <CardDescription>
          Configure suas credenciais de API para conectar seu dashboard ao Google Ads.
          {user?.role === 'admin' ? ' Como administrador, você pode gerenciar esta integração.' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Informações Importantes</AlertTitle>
          <AlertDescription>
            Para configurar a integração com o Google Ads API, você precisa:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Criar um projeto no Google Cloud Console</li>
              <li>Ativar a Google Ads API</li>
              <li>Configurar as credenciais OAuth 2.0</li>
              <li>Obter o Developer Token no Google Ads</li>
              <li>Ter uma conta Google Ads com acesso à API</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            name="clientId"
            placeholder="Seu Client ID do Google Cloud Console"
            value={credentials.clientId}
            onChange={handleChange}
            disabled={isConnected || user?.role !== 'admin'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input
            id="clientSecret"
            name="clientSecret"
            type="password"
            placeholder="Seu Client Secret do Google Cloud Console"
            value={credentials.clientSecret}
            onChange={handleChange}
            disabled={isConnected || user?.role !== 'admin'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="developerToken">Developer Token</Label>
          <Input
            id="developerToken"
            name="developerToken"
            placeholder="Seu Developer Token do Google Ads"
            value={credentials.developerToken}
            onChange={handleChange}
            disabled={isConnected || user?.role !== 'admin'}
          />
          <p className="text-sm text-muted-foreground mt-1">
            O Developer Token pode ser obtido no Google Ads, em Ferramentas &gt; Configurações &gt; API Center.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="loginCustomerId">Login Customer ID</Label>
          <Input
            id="loginCustomerId"
            name="loginCustomerId"
            placeholder="ID da conta Google Ads (sem hífens)"
            value={credentials.loginCustomerId}
            onChange={handleChange}
            disabled={isConnected || user?.role !== 'admin'}
          />
          <p className="text-sm text-muted-foreground mt-1">
            O ID da conta Google Ads (sem hífens) que será usada para autenticação.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="redirectUri">URI de Redirecionamento Autorizado</Label>
          <div className="flex gap-2">
            <Input
              id="redirectUri"
              name="redirectUri"
              placeholder="URI de redirecionamento"
              value={credentials.redirectUri}
              onChange={handleChange}
              disabled={true}
              className="bg-muted"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyUri}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copiar URI</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Este URI é gerado automaticamente e não pode ser alterado. Adicione-o às URIs de redirecionamento autorizados no Console de Desenvolvedor Google.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
        {!isConnected ? (
          <div className="w-full space-y-2 sm:space-y-0 sm:space-x-2 sm:w-auto flex flex-col sm:flex-row">
            <Button 
              onClick={handleSaveCredentials} 
              variant="outline"
              disabled={user?.role !== 'admin'}
            >
              Salvar Credenciais
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={!credentials.clientId || !credentials.clientSecret || !credentials.developerToken || !credentials.loginCustomerId || user?.role !== 'admin'}
            >
              Conectar com Google Ads
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium">Conectado à API do Google Ads</p>
          </div>
        )}
        
        {isConnected && user?.role === 'admin' && (
          <Button variant="destructive" size="sm" onClick={handleDisconnect}>
            Desconectar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
