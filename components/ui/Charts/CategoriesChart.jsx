"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function CategoriesChart({ categoriesChartData, categoriesCharConfig }) {
  const chartWidth = Math.max(categoriesChartData.length * 30, 600);

  return (
    <Card className="h-full flex flex-col pt-2">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg text-center">
          Sentiment Distribution of Business Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
        <ChartContainer
          config={categoriesCharConfig}
          className="flex-grow overflow-x-auto"
        >
          <div style={{ width: chartWidth, height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoriesChartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 62.5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  interval={0}
                  tick={CustomizedAxisTick}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="positive"
                  stackId="a"
                  fill="var(--color-positive)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="negative"
                  stackId="a"
                  fill="var(--color-negative)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="mixed"
                  stackId="a"
                  fill="var(--color-mixed)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={-15.5}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-90)"
        style={{ fontSize: "12px" }}
      >
        {`${payload.value.slice(0, 10)}..`}
      </text>
    </g>
  );
};
