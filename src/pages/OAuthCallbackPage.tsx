import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus("error");
          toast.error("Falha na autenticação com o Google Ads");
          setTimeout(() => navigate("/dashboard/settings"), 3000);
          return;
        }

        if (!code || !user) {
          setStatus("error");
          toast.error("Código de autorização não encontrado");
          setTimeout(() => navigate("/dashboard/settings"), 3000);
          return;
        }

        // Trocar o código por tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code,
            client_id: user.google_ads_client_id || '',
            client_secret: user.google_ads_client_secret || '',
            redirect_uri: window.location.origin + '/oauth-callback',
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Falha ao obter tokens');
        }

        const tokens = await tokenResponse.json();

        // Salvar tokens no Supabase
        const { error: updateError } = await supabase
          .from('users')
          .update({
            google_ads_refresh_token: tokens.refresh_token,
            google_ads_access_token: tokens.access_token,
            google_ads_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        await updateUser();
        setStatus("success");
        toast.success("Conectado com sucesso ao Google Ads!");
        
        // Redirecionar de volta para a página de configurações
        setTimeout(() => navigate("/dashboard/settings"), 2000);
      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus("error");
        toast.error("Erro ao processar autenticação");
        setTimeout(() => navigate("/dashboard/settings"), 3000);
      }
    };

    handleCallback();
  }, [navigate, user, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardContent className="pt-6 text-center">
          {status === "processing" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h2 className="text-xl font-semibold mt-4">Processando autenticação</h2>
              <p className="text-muted-foreground mt-2">Aguarde enquanto finalizamos o processo de autenticação com o Google Ads...</p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mt-4">Autenticação bem-sucedida!</h2>
              <p className="text-muted-foreground mt-2">Conectado à API do Google Ads com sucesso.</p>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mt-4">Falha na autenticação</h2>
              <p className="text-muted-foreground mt-2">Ocorreu um erro ao conectar com a API do Google Ads. Tente novamente.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OAuthCallbackPage;
