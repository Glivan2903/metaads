import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Home,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Target,
  Bell,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  
  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard size={24} className="text-primary" />
            <span>Métricas</span>
          </Link>
        )}
        {isCollapsed && (
          <LayoutDashboard size={24} className="mx-auto text-primary" />
        )}
      </div>
      <div className="flex-1 overflow-auto py-2 px-4">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <SidebarItem
            icon={Home}
            label="Dashboard"
            href="/dashboard"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={BarChart}
            label="Campanhas"
            href="/dashboard/campaigns"
            isCollapsed={isCollapsed}
          />
          {/* <SidebarItem
            icon={LineChart}
            label="Desempenho"
            href="/dashboard/performance"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={PieChart}
            label="Relatórios"
            href="/dashboard/reports"
            isCollapsed={isCollapsed}
          /> */}
          {user?.role === 'admin' && (
            <SidebarItem
              icon={Settings}
              label="Configurações"
              href="/dashboard/settings"
              isCollapsed={isCollapsed}
            />
          )}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          size="icon"
          className="w-full flex justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </div>
  );
}

export default DashboardSidebar;
