import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";

export function KpiCard({
  title,
  value,
  icon,
  avg = false,
  distributedRatings = null,
  status = "neutral",
  description = "",
  empty = false,
}) {
  const statusIcon = {
    positive: <ArrowUpCircle className="h-6 w-6 text-green-500" />,
    negative: <ArrowDownCircle className="h-6 w-6 text-red-500" />,
    neutral: <MinusCircle className="h-6 w-6 text-yellow-500" />,
    mixed: <MinusCircle className="h-6 w-6 text-yellow-500" />,
  };

  return empty ? (
    <Card className="w-full flex flex-col justify-between px-3 py-2">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">&nbsp;</CardTitle>
          &nbsp;
        </div>
        <div className="text-2xl font-bold">&nbsp;</div>
      </CardHeader>

      <p className="text-xs text-muted-foreground mt-2">&nbsp;</p>
    </Card>
  ) : (
    <Card className="w-full flex flex-col justify-between px-3 py-2">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {statusIcon[status]}
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardHeader>

      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </Card>
  );
}
