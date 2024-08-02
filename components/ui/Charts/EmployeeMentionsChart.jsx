"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function EmployeeMentionsChart({ staffChartData, staffChartConfig }) {
  const totalMentions = React.useMemo(() => {
    return staffChartData.reduce((acc, curr) => acc + curr.mentions, 0);
  }, [staffChartData]);

  const CustomTooltipContent = React.useCallback(({ payload }) => {
    if (payload && payload.length) {
      const data = payload[0].payload;
      const totalSentiments = data.positive + data.negative + data.mixed;

      const sentimentPercentage = (sentiment) => {
        return ((data[sentiment] / totalSentiments) * 100).toFixed(1);
      };

      return (
        <div className="bg-background p-3 rounded-lg shadow-md border border-border">
          <h3 className="font-semibold text-sm mb-2">{data.employee}</h3>
          <p className="text-xs mb-2">Total Mentions: {data.mentions}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs gap-1">
              <span className="text-green-500">Positive:</span>
              <span>
                {data.positive} ({sentimentPercentage("positive")}%)
              </span>
            </div>
            <div className="flex justify-between text-xs gap-1">
              <span className="text-red-500">Negative:</span>
              <span>
                {data.negative} ({sentimentPercentage("negative")}%)
              </span>
            </div>
            <div className="flex justify-between text-xs gap-1">
              <span className="text-yellow-500">Mixed:</span>
              <span>
                {data.mixed} ({sentimentPercentage("mixed")}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, []);

  return (
    <Card className="flex flex-col py-4">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-md">Top Mentioned Employees</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={staffChartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            <Pie
              data={staffChartData}
              dataKey="mentions"
              nameKey="employee"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMentions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Mentions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

            {/* <ChartLegend
              content={<ChartLegendContent nameKey="employee" />}
              className="flex justify-center items-center flex-wrap px-2"
            /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
