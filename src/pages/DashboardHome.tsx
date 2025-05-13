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

// Sample data for charts
const performanceData = [
  { name: "01/05", impressions: 34000, clicks: 2400, conversions: 240 },
  { name: "02/05", impressions: 42000, clicks: 2800, conversions: 310 },
  { name: "03/05", impressions: 38000, clicks: 2100, conversions: 250 },
  { name: "04/05", impressions: 45000, clicks: 3200, conversions: 380 },
  { name: "05/05", impressions: 50000, clicks: 3800, conversions: 450 },
  { name: "06/05", impressions: 47000, clicks: 3600, conversions: 420 },
  { name: "07/05", impressions: 52000, clicks: 4200, conversions: 520 },
  { name: "08/05", impressions: 54000, clicks: 4500, conversions: 580 },
  { name: "09/05", impressions: 58000, clicks: 4800, conversions: 620 },
  { name: "10/05", impressions: 61000, clicks: 5100, conversions: 670 },
  { name: "11/05", impressions: 59000, clicks: 4900, conversions: 640 },
  { name: "12/05", impressions: 63000, clicks: 5300, conversions: 690 },
  { name: "13/05", impressions: 65000, clicks: 5600, conversions: 720 },
  { name: "14/05", impressions: 68000, clicks: 6000, conversions: 780 },
];

const costData = [
  { name: "Google", value: 35000, color: "#4285F4" },
  { name: "Facebook", value: 28000, color: "#1877F2" },
  { name: "Instagram", value: 22000, color: "#E1306C" },
  { name: "LinkedIn", value: 15000, color: "#0077B5" },
  { name: "TikTok", value: 10000, color: "#000000" },
];

const conversionsByChannelData = [
  { name: "Google", conversions: 420, cpa: 83.3 },
  { name: "Facebook", conversions: 350, cpa: 80 },
  { name: "Instagram", conversions: 280, cpa: 78.6 },
  { name: "LinkedIn", conversions: 180, cpa: 83.3 },
  { name: "TikTok", conversions: 120, cpa: 83.3 },
];

// Sample data for campaigns
const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Campanha Black Friday",
    status: "ativa",
    platform: "Google Ads",
    budget: 50000,
    spent: 42500,
    impressions: 580000,
    clicks: 32000,
    conversions: 3200,
    ctr: 0.0552,
    cpc: 1.33,
    cpa: 13.28,
  },
  {
    id: "2",
    name: "Remarketing Clientes",
    status: "ativa",
    platform: "Facebook Ads",
    budget: 30000,
    spent: 18500,
    impressions: 420000,
    clicks: 25800,
    conversions: 2150,
    ctr: 0.0614,
    cpc: 0.72,
    cpa: 8.60,
  },
  {
    id: "3",
    name: "Lançamento Produto X",
    status: "pausada",
    platform: "Instagram Ads",
    budget: 45000,
    spent: 25800,
    impressions: 380000,
    clicks: 22400,
    conversions: 1860,
    ctr: 0.0589,
    cpc: 1.15,
    cpa: 13.87,
  },
  {
    id: "4",
    name: "Campanha Lead B2B",
    status: "encerrada",
    platform: "LinkedIn Ads",
    budget: 25000,
    spent: 25000,
    impressions: 180000,
    clicks: 9600,
    conversions: 480,
    ctr: 0.0533,
    cpc: 2.60,
    cpa: 52.08,
  },
  {
    id: "5",
    name: "Awareness Gen Z",
    status: "planejada",
    platform: "TikTok Ads",
    budget: 20000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    cpa: 0,
  },
];

export function DashboardHome() {
  const [period, setPeriod] = useState("14d");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(sampleCampaigns);

  // Filter campaigns based on selection
  useEffect(() => {
    if (selectedCampaign === "all") {
      setFilteredCampaigns(sampleCampaigns);
    } else {
      const filtered = sampleCampaigns.filter(campaign => campaign.id === selectedCampaign);
      setFilteredCampaigns(filtered);
    }
  }, [selectedCampaign]);

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
  
  const totalClicks = filteredCampaigns.reduce((sum, item) => sum + item.clicks, 0);
  const totalImpressions = filteredCampaigns.reduce((sum, item) => sum + item.impressions, 0);
  const totalConversions = filteredCampaigns.reduce((sum, item) => sum + item.conversions, 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const averageCTR = totalClicks / totalImpressions || 0;
  const averageCPA = totalSpent / totalConversions || 0;
  
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
              {sampleCampaigns.map((campaign) => (
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
            data={performanceData}
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
            data={costData}
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
            <CampaignTable campaigns={filteredCampaigns.length > 0 ? filteredCampaigns : sampleCampaigns} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartComponent
          title="Conversões por Canal"
          description="Total de conversões por plataforma de anúncio"
          data={conversionsByChannelData}
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
