
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";

export type Campaign = {
  id: string;
  name: string;
  status: "ativa" | "pausada" | "encerrada" | "planejada";
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
};

interface CampaignTableProps {
  campaigns: Campaign[];
  onViewDetails?: (id: string) => void;
  onEditCampaign?: (id: string) => void;
  onDuplicateCampaign?: (id: string) => void;
  onDeleteCampaign?: (id: string) => void;
}

export function CampaignTable({ 
  campaigns,
  onViewDetails,
  onEditCampaign,
  onDuplicateCampaign,
  onDeleteCampaign
}: CampaignTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Campaign>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedCampaigns = [...campaigns]
    .filter((campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

  const toggleSort = (column: keyof Campaign) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "ativa":
        return "bg-green-500 text-white";
      case "pausada":
        return "bg-yellow-500 text-white";
      case "encerrada":
        return "bg-muted text-muted-foreground";
      case "planejada":
        return "bg-blue-300 text-blue-900";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPercentSpent = (spent: number, budget: number) => {
    return (spent / budget) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar campanhas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => toggleSort("name")} className="cursor-pointer">
                <div className="flex items-center">
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead onClick={() => toggleSort("budget")} className="cursor-pointer">
                <div className="flex items-center">
                  Orçamento
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("spent")} className="cursor-pointer">
                <div className="flex items-center">
                  Gasto
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("impressions")} className="cursor-pointer">
                <div className="flex items-center">
                  Impressões
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("clicks")} className="cursor-pointer">
                <div className="flex items-center">
                  Cliques
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("ctr")} className="cursor-pointer">
                <div className="flex items-center">
                  CTR
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("conversions")} className="cursor-pointer">
                <div className="flex items-center">
                  Conversões
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Nenhuma campanha encontrada.
                </TableCell>
              </TableRow>
            ) : (
              sortedCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{formatCurrency(campaign.spent)}</span>
                        <span>{getPercentSpent(campaign.spent, campaign.budget).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(getPercentSpent(campaign.spent, campaign.budget), 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(campaign.impressions)}</TableCell>
                  <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell>{formatPercentage(campaign.ctr)}</TableCell>
                  <TableCell>{formatNumber(campaign.conversions)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetails?.(campaign.id)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCampaign?.(campaign.id)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateCampaign?.(campaign.id)}>
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDeleteCampaign?.(campaign.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CampaignTable;
