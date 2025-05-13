import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CampaignTable, { Campaign } from "@/components/CampaignTable";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Types for campaign form
type CampaignFormData = {
  name: string;
  platform: string;
  budget: string;
  status: string;
};

export function CampaignsPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    platform: "",
    budget: "",
    status: "planejada",
  });
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  
  // Buscar campanhas reais da integração ao carregar a página
  useEffect(() => {
    // Exemplo:
    // fetchCampaigns().then(setCampaigns);
  }, []);

  // Handlers for campaign actions
  const handleViewDetails = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      toast({
        title: "Detalhes da campanha",
        description: `Visualizando detalhes de: ${campaign.name}`,
      });
    }
  };

  const handleEditCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setCampaignToEdit(campaign);
      setFormData({
        name: campaign.name,
        platform: campaign.platform,
        budget: campaign.budget.toString(),
        status: campaign.status,
      });
      setIsNewCampaignOpen(true);
    }
  };

  const handleDuplicateCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const newCampaign: Campaign = {
        ...campaign,
        id: `${Date.now()}`,
        name: `${campaign.name} (Cópia)`,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
      toast({
        title: "Campanha duplicada",
        description: `${campaign.name} foi duplicada com sucesso.`,
      });
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCampaign = () => {
    if (campaignToDelete) {
      const campaign = campaigns.find(c => c.id === campaignToDelete);
      setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete));
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
      
      if (campaign) {
        toast({
          title: "Campanha excluída",
          description: `${campaign.name} foi excluída com sucesso.`,
          variant: "destructive",
        });
      }
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.platform || !formData.budget) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (campaignToEdit) {
      // Update existing campaign
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.id === campaignToEdit.id) {
          return {
            ...campaign,
            name: formData.name,
            platform: formData.platform,
            budget: parseFloat(formData.budget),
            status: formData.status as Campaign["status"],
          };
        }
        return campaign;
      }));

      toast({
        title: "Campanha atualizada",
        description: `${formData.name} foi atualizada com sucesso.`,
      });
    } else {
      // Create new campaign
      const newCampaign: Campaign = {
        id: `${Date.now()}`,
        name: formData.name,
        platform: formData.platform,
        budget: parseFloat(formData.budget),
        status: formData.status as Campaign["status"],
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
      };

      setCampaigns(prev => [...prev, newCampaign]);
      toast({
        title: "Campanha criada",
        description: `${formData.name} foi criada com sucesso.`,
      });
    }

    // Reset form and close dialog
    setFormData({
      name: "",
      platform: "",
      budget: "",
      status: "planejada",
    });
    setCampaignToEdit(null);
    setIsNewCampaignOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Campanhas</h1>
        <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{campaignToEdit ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
              <DialogDescription>
                {campaignToEdit 
                  ? "Edite os detalhes da campanha existente" 
                  : "Preencha os detalhes para criar uma nova campanha"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform" className="text-right">
                  Plataforma
                </Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => handleSelectChange("platform", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                    <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                    <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                    <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Orçamento (R$)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejada">Planejada</SelectItem>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="encerrada">Encerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCampaignOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>
                {campaignToEdit ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campanhas</CardTitle>
          <CardDescription>
            Gerencie suas campanhas de tráfego pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Nenhuma campanha disponível</div>
          ) : (
            <CampaignTable 
              campaigns={campaigns} 
              onViewDetails={handleViewDetails}
              onEditCampaign={handleEditCampaign}
              onDuplicateCampaign={handleDuplicateCampaign}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDeleteCampaign}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CampaignsPage;
