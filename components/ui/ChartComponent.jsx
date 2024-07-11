"use client";

import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  averageRating: {
    label: "Average Rating",
    color: "hsl(var(--chart-1))",
  },
  totalReviews: {
    label: "Total Reviews",
    color: "hsl(var(--chart-2))",
  },
  responsesCount: {
    label: "Response Rate",
    color: "hsl(var(--chart-3))",
  },
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-4))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-5))",
  },
  mixed: {
    label: "Mixed",
    color: "hsl(var(--chart-6))",
  },
};

export function ChartComponent({ dashboardData }) {
  if (!dashboardData) {
    return null;
  }

  const [currentChart, setCurrentChart] = useState("averageRating");

  const chartData = dashboardData.reviewData;
  const metrics = dashboardData.allTimeMetrics;

  const renderChart = () => {
    switch (currentChart) {
      case "averageRating":
        return (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="averageRating"
                type="natural"
                fill="var(--color-averageRating)"
                fillOpacity={0.4}
                stroke="var(--color-averageRating)"
              />
            </AreaChart>
          </ChartContainer>
        );
      case "totalReviews":
        return (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="positiveReviews"
                fill="var(--color-positive)"
                radius={4}
                stackId="a"
              />
              <Bar
                dataKey="negativeReviews"
                fill="var(--color-negative)"
                radius={4}
                stackId="a"
              />
              <Bar
                dataKey="mixedReviews"
                fill="var(--color-mixed)"
                radius={4}
                stackId="a"
              />
            </BarChart>
          </ChartContainer>
        );
      case "responsesCount":
        return (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="responsesCount"
                fill="var(--color-responsesCount)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="grid grid-cols-3 w-full">
          {["averageRating", "totalReviews", "responsesCount"].map((key) => (
            <button
              key={key}
              data-active={currentChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setCurrentChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {key === "responsesCount"
                  ? `${((metrics[key] / metrics.totalReviews) * 100).toFixed(
                      2
                    )}%`
                  : key === "averageRating"
                  ? metrics[key]
                  : metrics[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">{renderChart()}</CardContent>
    </Card>
  );
}
