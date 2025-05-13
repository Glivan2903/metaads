import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import LineChartComponent from "@/components/LineChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import PieChartComponent from "@/components/PieChartComponent";
import CampaignTable, { Campaign } from "@/components/CampaignTable";
import { BarChart, LineChart, PieChart, Target } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/DateRangePicker";
import { addDays, format, subDays } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";

export function DashboardHome() {
  const [period, setPeriod] = useState("14d");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  // Buscar campanhas reais da integração ao carregar a página
  useEffect(() => {
    // Buscar do localStorage, contexto global, ou API, conforme implementado na página de campanhas
    // Exemplo usando localStorage:
    // const storedCampaigns = localStorage.getItem('campaigns');
    // if (storedCampaigns) {
    //   const parsed = JSON.parse(storedCampaigns);
    //   setCampaigns(parsed);
    //   setFilteredCampaigns(parsed);
    // }
    // Ou, se houver um contexto global:
    // setCampaigns(contextCampaigns);
    // setFilteredCampaigns(contextCampaigns);
  }, []);

  // Filtrar campanhas conforme seleção
  useEffect(() => {
    if (selectedCampaign === "all") {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter(c => c.id === selectedCampaign));
    }
  }, [selectedCampaign, campaigns]);

  // Handle date range change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // In a real app, this would fetch data based on the date range
      toast({
        title: "Data filtrada",
        description: `De: ${format(dateRange.from, 'dd/MM/yyyy')} a ${format(dateRange.to, 'dd/MM/yyyy')}`,
      });
    }
  }, [dateRange]);

  // Handle period preset change
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    const today = new Date();
    
    switch (value) {
      case "7d":
        setDateRange({
          from: subDays(today, 7),
          to: today,
        });
        break;
      case "14d":
        setDateRange({
          from: subDays(today, 14),
          to: today,
        });
        break;
      case "30d":
        setDateRange({
          from: subDays(today, 30),
          to: today,
        });
        break;
      case "90d":
        setDateRange({
          from: subDays(today, 90),
          to: today,
        });
        break;
    }
  };
  
  const totalClicks = filteredCampaigns.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const totalImpressions = filteredCampaigns.reduce((sum, item) => sum + (item.impressions || 0), 0);
  const totalConversions = filteredCampaigns.reduce((sum, item) => sum + (item.conversions || 0), 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0);
  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0);
  const averageCTR = totalImpressions ? totalClicks / totalImpressions : 0;
  const averageCPA = totalConversions ? totalSpent / totalConversions : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Métricas</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Tabs defaultValue="14d" value={period} onValueChange={handlePeriodChange} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="14d">14 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
              <TabsTrigger value="90d">90 dias</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todas as campanhas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as campanhas</SelectItem>
              {/* Renderização condicional para campanhas reais */}
              {filteredCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Impressões"
          value={new Intl.NumberFormat('pt-BR').format(totalImpressions)}
          change={12.5}
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Cliques"
          value={new Intl.NumberFormat('pt-BR').format(totalClicks)}
          change={8.2}
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="Taxa de Cliques (CTR)"
          value={`${(averageCTR * 100).toFixed(2)}%`}
          change={-2.1}
          icon={<BarChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Conversões"
          value={new Intl.NumberFormat('pt-BR').format(totalConversions)}
          change={15.3}
          icon={<PieChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Investimento"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Custo por Clique (CPC)"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent / totalClicks || 0)}
          change={-4.2}
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Custo por Aquisição (CPA)"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageCPA)}
          change={-6.8}
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Orçamento Utilizado"
          value={`${((totalSpent / totalBudget) * 100 || 0).toFixed(1)}%`}
          icon={<BarChart className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartComponent
            title="Desempenho da Campanha"
            description="Impressões, cliques e conversões nos últimos 14 dias"
            data={[]}
            lines={[
              { dataKey: "impressions", stroke: "#3b82f6", name: "Impressões" },
              { dataKey: "clicks", stroke: "#10b981", name: "Cliques" },
              { dataKey: "conversions", stroke: "#f59e0b", name: "Conversões" },
            ]}
            height={350}
          />
        </div>
        
        <div>
          <PieChartComponent
            title="Distribuição de Investimento"
            description="Investimento por plataforma"
            data={[]}
            height={350}
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
            <CardDescription>
              Visão geral de todas as campanhas atuais
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">Nenhum dado disponível</div>
            ) : (
              <CampaignTable campaigns={filteredCampaigns} />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartComponent
          title="Conversões por Canal"
          description="Total de conversões por plataforma de anúncio"
          data={[]}
          bars={[
            { dataKey: "conversions", fill: "#3b82f6", name: "Conversões" },
            { dataKey: "cpa", fill: "#f59e0b", name: "CPA (R$)" },
          ]}
          height={350}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Metas vs. Realizações</CardTitle>
            <CardDescription>Progresso das metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Conversões</span>
                <span className="font-medium">
                  {totalConversions} / 8.000
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(totalConversions / 8000) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Orçamento</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)} / {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(totalSpent / totalBudget) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>CTR</span>
                <span className="font-medium">
                  {(averageCTR * 100).toFixed(2)}% / 9.00%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(averageCTR / 0.09) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>CPA</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageCPA)} / {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(15)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success-500"
                  style={{ width: `${(15 / averageCPA) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardHome;
