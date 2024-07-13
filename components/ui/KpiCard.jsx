import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";

export function KpiCard({
  title,
  value,
  icon,
  avg = false,
  distributedRatings = null,
  status = "neutral",
  description = ""
}) {
  const statusIcon = {
    positive: <ArrowUpCircle className="h-6 w-6 text-green-500" />,
    negative: <ArrowDownCircle className="h-6 w-6 text-red-500" />,
    neutral: <MinusCircle className="h-6 w-6 text-yellow-500" />,
  };

  return (
    <Card className="w-full p-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {statusIcon[status]}
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}