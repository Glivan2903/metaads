import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer } from "lucide-react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

// Dados de exemplo para campanhas e métricas
const sampleCampaigns = [
  { id: "1", name: "Campanha Black Friday" },
  { id: "2", name: "Remarketing Clientes" },
  { id: "3", name: "Lançamento Produto X" },
];

const availableMetrics = [
  { id: "impressions", label: "Impressões" },
  { id: "clicks", label: "Cliques" },
  { id: "conversions", label: "Conversões" },
  { id: "ctr", label: "Taxa de Cliques (CTR)" },
  { id: "cpc", label: "Custo por Clique (CPC)" },
  { id: "cpa", label: "Custo por Aquisição (CPA)" },
  { id: "spent", label: "Investimento" },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["impressions", "clicks", "conversions"]);

  // Função para imprimir
  const handlePrint = () => {
    window.print();
  };

  // Função para download em PDF (simples, usando print para PDF)
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} title="Imprimir">
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={handleDownloadPDF} title="Baixar PDF">
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>
            Selecione o período, campanha e métricas desejadas para gerar o relatório personalizado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas as campanhas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as campanhas</SelectItem>
                {sampleCampaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedMetrics[0]}
              onValueChange={(value) => setSelectedMetrics([value])}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Métrica" />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualização do Relatório</CardTitle>
          <CardDescription>
            Relatório gerado para o período de {dateRange.from && format(dateRange.from, 'dd/MM/yyyy')} até {dateRange.to && format(dateRange.to, 'dd/MM/yyyy')}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aqui você pode renderizar uma tabela ou gráficos com os dados filtrados */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Campanha</th>
                  {selectedMetrics.map((metric) => (
                    <th key={metric} className="border px-4 py-2">{availableMetrics.find(m => m.id === metric)?.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Exemplo de linha de relatório */}
                {(selectedCampaign === "all" ? sampleCampaigns : sampleCampaigns.filter(c => c.id === selectedCampaign)).map((c) => (
                  <tr key={c.id}>
                    <td className="border px-4 py-2">{c.name}</td>
                    {selectedMetrics.map((metric) => (
                      <td key={metric} className="border px-4 py-2">-</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 