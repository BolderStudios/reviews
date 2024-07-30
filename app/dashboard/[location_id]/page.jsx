// app/dashboard/[location_id]/page.jsx

import Dashboard from "@/components/Dashboard";
import supabase from "@/utils/supabaseClient";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { location_id } = params;

  const { data: location, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", location_id)
    .single();

  if (error || !location) {
    notFound();
  }

  const { data: positiveReviews, error: positiveReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Positive");
  const { data: negativeReviews, error: negativeReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Negative");
  const { data: mixedReviews, error: mixedReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id)
    .eq("sentiment", "Mixed");

  console.log("Positive reviews length: ", positiveReviews.length);
  console.log("Negative reviews length: ", negativeReviews.length);
  console.log("Mixed reviews length: ", mixedReviews.length);

  const sentimentDistribution = {
    positive: positiveReviews.length,
    negative: negativeReviews.length,
    mixed: mixedReviews.length,
  };

  const { data: staffMentions, error: staffMentionsError } = await supabase
    .from("staff_mentions")
    .select("*")
    .eq("location_id", location_id);

  // Count occurrences of each employee name
  const employeeCounts = staffMentions.reduce((counts, mention) => {
    counts.set(
      mention.employee_name,
      (counts.get(mention.employee_name) || 0) + 1
    );
    return counts;
  }, new Map());

  // Convert to array and sort by count
  const sortedEmployees = Array.from(employeeCounts, ([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count);

  // Take the top 4 mentioned employees
  const top4 = sortedEmployees.slice(0, 4);

  // Calculate the sum of mentions for the rest
  const otherMentions = sortedEmployees
    .slice(4)
    .reduce((sum, emp) => sum + emp.count, 0);

  // Create the chartData array
  const staffChartData = [
    ...top4.map((emp, index) => ({
      employee: emp.name,
      mentions: emp.count,
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    {
      employee: "Other",
      mentions: otherMentions,
      fill: "hsl(var(--chart-5))",
    },
  ];

  // Create the chartConfig object
  const staffChartConfig = {
    mentions: {
      label: "Mentions",
    },
    ...top4.reduce(
      (config, emp, index) => ({
        ...config,
        [emp.name]: {
          label: emp.name,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      }),
      {}
    ),
    Other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <Dashboard
      selectedLocation={location}
      sentimentDistribution={sentimentDistribution}
      staffChartData={staffChartData}
      staffChartConfig={staffChartConfig}
    />
  );
}
