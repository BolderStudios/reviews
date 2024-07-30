"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  reviews: {
    label: "Reviews",
  },
  positive: {
    label: "Positive",
    color: "hsl(var(--positive))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--negative))",
  },
  mixed: {
    label: "Mixed",
    color: "hsl(var(--warning))",
  },
};

export function SentimentDistribution({ sentimentDistribution }) {
  console.log("Sentiment Distribution: ", sentimentDistribution);

  const chartData = [
    {
      sentiment: "positive",
      reviews: sentimentDistribution.positive,
      fill: "var(--color-positive)",
    },
    {
      sentiment: "negative",
      reviews: sentimentDistribution.negative,
      fill: "var(--color-negative)",
    },
    {
      sentiment: "mixed",
      reviews: sentimentDistribution.mixed,
      fill: "var(--color-mixed)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pt-4">
        <CardTitle className="text-md text-center">
          Sentiment distribution of <br />
          customer reviews
        </CardTitle>
        {/* <CardDescription className="text-sm text-center">
          Sentiment distribution of customer reviews
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="reviews" hideLabel />}
            />
            <Pie data={chartData} dataKey="reviews">
              <LabelList
                dataKey="sentiment"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
