"use client";

import { TrendingUp, TrendingDown, Frown, Meh, Smile } from "lucide-react";
import { Pie, PieChart } from "recharts";

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
  const chartData = [
    {
      sentiment: "positive",
      reviews: sentimentDistribution.positive,
      fill: chartConfig.positive.color,
    },
    {
      sentiment: "negative",
      reviews: sentimentDistribution.negative,
      fill: chartConfig.negative.color,
    },
    {
      sentiment: "mixed",
      reviews: sentimentDistribution.mixed,
      fill: chartConfig.mixed.color,
    },
  ];

  const totalReviews = chartData.reduce((sum, item) => sum + item.reviews, 0);
  console.log("totalReviews", totalReviews);
  const positivePercentage = (
    (sentimentDistribution.positive / totalReviews) *
    100
  ).toFixed(1);

  const getIcon = () => {
    if (positivePercentage >= 90)
      return <Smile className="h-4 w-4 text-green-500" />;
    if (positivePercentage >= 75)
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (positivePercentage >= 50)
      return <Meh className="h-4 w-4 text-yellow-500" />;
    return <Frown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="flex flex-col py-4">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-md">Sentiment Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="reviews"
                  formatter={(value, name, props) => {
                    const sentiment = props.payload.sentiment;
                    const capitalizedSentiment =
                      sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
                    return `${capitalizedSentiment} Reviews: ${value} (${(
                      (value / totalReviews) *
                      100
                    ).toFixed(1)}%)`;
                  }}
                />
              }
            />

            <Pie data={chartData} dataKey="reviews" label nameKey="reviews" />
            <ChartLegend
              content={<ChartLegendContent nameKey="sentiment" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {positivePercentage}% are positive reviews {getIcon()}
        </div>
        <div className="leading-none text-muted-foreground">
          Based on {totalReviews} total reviews
        </div>
      </CardFooter>
    </Card>
  );
}
