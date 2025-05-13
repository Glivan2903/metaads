
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useTheme } from "@/hooks/use-theme";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  lines: {
    dataKey: string;
    stroke: string;
    name: string;
  }[];
  yAxisLabel?: string;
  height?: number;
}

export function LineChartComponent({
  title,
  description,
  data,
  lines,
  yAxisLabel,
  height = 300,
}: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                stroke={textColor}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={textColor} 
                tick={{ fontSize: 12 }}
                label={
                  yAxisLabel ? { 
                    value: yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: textColor, fontSize: 12 }
                  } : undefined
                }
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#475569" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#0f172a"
                }}
              />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.stroke}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default LineChartComponent;
