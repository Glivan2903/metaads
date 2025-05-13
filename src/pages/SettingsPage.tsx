import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAdsApiIntegration } from "@/components/GoogleAdsApiIntegration";
import { UserProfile } from "@/components/UserProfile";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      </div>
      
      <Tabs defaultValue="integrações" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrações">Integrações</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          {user?.role === 'admin' && <TabsTrigger value="usuários">Usuários</TabsTrigger>}
          <TabsTrigger value="preferências">Preferências</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrações" className="space-y-4">
          <h2 className="text-xl font-semibold">Integrações de API</h2>
          <p className="text-muted-foreground mb-6">
            Configure integrações com plataformas de anúncios para importar dados automaticamente para o dashboard.
          </p>
          
          <GoogleAdsApiIntegration />
          
          <div className="mt-8 opacity-60">
            <h3 className="text-lg font-medium mb-4">Mais integrações em breve</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map(platform => (
                <div key={platform} className="border rounded-lg p-4 flex items-center justify-between">
                  <span>{platform}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">Em breve</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="perfil">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="usuários">
          {user?.role === 'admin' ? (
            <UserManagement />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta seção.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preferências">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preferências do Dashboard</h2>
            <p className="text-muted-foreground">
              Esta seção será implementada nas próximas versões.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
