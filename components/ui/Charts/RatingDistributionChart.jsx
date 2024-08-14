"use client";

import { Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  reviews: {
    label: "Rating",
  },
  fiveStars: {
    label: "5 stars",
    color: "hsl(var(--fiveStars))",
  },
  fourStars: {
    label: "4 stars",
    color: "hsl(var(--fourStars))",
  },
  threeStars: {
    label: "3 stars",
    color: "hsl(var(--threeStars))",
  },
  twoStars: {
    label: "2 stars",
    color: "hsl(var(--twoStars))",
  },
  oneStar: {
    label: "1 star",
    color: "hsl(var(--oneStar))",
  },
};

export function RatingDistributionChart({ ratingDistribution }) {
  const chartData = [
    {
      rating: "5 stars",
      reviews: ratingDistribution.fiveStars,
      fill: chartConfig.fiveStars.color,
    },
    {
      rating: "4 stars",
      reviews: ratingDistribution.fourStars,
      fill: chartConfig.fourStars.color,
    },
    {
      rating: "3 stars",
      reviews: ratingDistribution.threeStars,
      fill: chartConfig.threeStars.color,
    },
    {
      rating: "2 stars",
      reviews: ratingDistribution.twoStars,
      fill: chartConfig.twoStars.color,
    },
    {
      rating: "1 star",
      reviews: ratingDistribution.oneStar,
      fill: chartConfig.oneStar.color,
    },
  ];

  const totalReviews = chartData.reduce((sum, item) => sum + item.reviews, 0);

  return (
    <Card className="flex flex-col py-2 w-[247px]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Rating Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
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
                    const rating = props.payload.rating;

                    return `${rating}: ${value} (${(
                      (value / totalReviews) *
                      100
                    ).toFixed(1)}%)`;
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="reviews"
              nameKey="rating"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => entry.reviews}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="rating" />}
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 p-0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
