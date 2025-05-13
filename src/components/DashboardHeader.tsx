import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-2 sm:px-4 md:px-6">
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="font-semibold text-base sm:text-lg md:text-xl tracking-tight truncate max-w-[120px] sm:max-w-xs md:max-w-none">
          Dashboard de Métricas
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        {searchOpen ? (
          <div className="relative w-32 sm:w-48 md:w-64">
            <Input
              placeholder="Pesquisar..."
              className="w-full"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0"
              onClick={() => setSearchOpen(false)}
            >
              <Search size={18} />
            </Button>
          </div>
        ) : (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
            <span className="sr-only">Search</span>
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Campanha "Black Friday" excedeu o orçamento</DropdownMenuItem>
            <DropdownMenuItem>Novo relatório semanal disponível</DropdownMenuItem>
            <DropdownMenuItem>Meta de conversão atingida!</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full border border-border"
            >
              <User size={18} />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col">
              <span>{user?.full_name}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </span>
              <Badge variant="outline" className="mt-1 w-fit">
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardHeader;
