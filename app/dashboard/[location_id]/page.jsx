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

  if (staffMentionsError) {
    console.error("Error fetching staff mentions:", staffMentionsError);
    // Handle the error appropriately
  }

  const employeeData = staffMentions.reduce((data, mention) => {
    const employeeName = mention.employee_name;
    const sentiment = mention.sentiment.toLowerCase();

    if (!data[employeeName]) {
      data[employeeName] = { count: 0, positive: 0, negative: 0, mixed: 0 };
    }

    data[employeeName].count++;
    data[employeeName][sentiment]++;

    return data;
  }, {});

  const sortedEmployees = Object.entries(employeeData)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  const top4 = sortedEmployees.slice(0, 4);

  const otherMentions = sortedEmployees.slice(4).reduce(
    (sum, emp) => ({
      count: sum.count + emp.count,
      positive: sum.positive + emp.positive,
      negative: sum.negative + emp.negative,
      mixed: sum.mixed + emp.mixed,
    }),
    { count: 0, positive: 0, negative: 0, mixed: 0 }
  );

  const staffChartData = [
    ...top4.map((emp, index) => ({
      employee: emp.name,
      mentions: emp.count,
      positive: emp.positive,
      negative: emp.negative,
      mixed: emp.mixed,
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    {
      employee: "Other",
      mentions: otherMentions.count,
      positive: otherMentions.positive,
      negative: otherMentions.negative,
      mixed: otherMentions.mixed,
      fill: "hsl(var(--chart-5))",
    },
  ];

  console.log("Staff chart data: ", staffChartData);

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
