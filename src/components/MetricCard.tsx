
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  change, 
  className 
}: MetricCardProps) {
  const showChange = change !== undefined;
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const absChange = Math.abs(change || 0);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {showChange && (
          <div className="mt-2 flex items-center text-sm">
            {isPositive && (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-success-500" />
            )}
            {isNegative && (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-destructive-500" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive && "text-success-500",
                isNegative && "text-destructive-500"
              )}
            >
              {isPositive && "+"}
              {change}%
            </span>
            <span className="ml-1 text-muted-foreground">do período anterior</span>
          </div>
        )}
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
