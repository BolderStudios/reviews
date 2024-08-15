// app/dashboard/[location_id]/page.jsx

import Dashboard from "@/components/Dashboard";
import { notFound } from "next/navigation";
import supabase from "@/utils/supabaseClient";

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

  const { data: allProductMentions, error: allProductMentionsError } =
    await supabase
      .from("product_service_feedback")
      .select("item, sentiment")
      .eq("location_id", location_id);

  // console.log("All product mentions: ", allProductMentions);
  // console.log("All product mentions length: ", allProductMentions.length);

  const { data: allReviews, error: allReviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("location_id", location_id);

  const fiveStars = allReviews.filter((review) => review.rating === 5).length;
  const fourStars = allReviews.filter((review) => review.rating === 4).length;
  const threeStars = allReviews.filter((review) => review.rating === 3).length;
  const twoStars = allReviews.filter((review) => review.rating === 2).length;
  const oneStar = allReviews.filter((review) => review.rating === 1).length;

  const ratingDistribution = {
    fiveStars,
    fourStars,
    threeStars,
    twoStars,
    oneStar,
  };

  const posReviewsLength = allReviews.filter(
    (review) => review.sentiment === "Positive"
  ).length;

  const negReviewsLength = allReviews.filter(
    (review) => review.sentiment === "Negative"
  ).length;

  const mixedReviewsLength = allReviews.filter(
    (review) => review.sentiment === "Mixed"
  ).length;

  const sentimentDistribution = {
    positive: posReviewsLength,
    negative: negReviewsLength,
    mixed: mixedReviewsLength,
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

  const top10 = sortedEmployees.slice(0, 5);

  const otherMentions = sortedEmployees.slice(5).reduce(
    (sum, emp) => ({
      count: sum.count + emp.count,
      positive: sum.positive + emp.positive,
      negative: sum.negative + emp.negative,
      mixed: sum.mixed + emp.mixed,
    }),
    { count: 0, positive: 0, negative: 0, mixed: 0 }
  );

  const staffChartData = [
    ...top10.map((emp, index) => ({
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
      fill: "hsl(var(--chart-100))",
    },
  ];

  const staffChartConfig = {
    mentions: {
      label: "Mentions",
    },
    ...top10.reduce(
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

  const { data: productFeedbackMentions, error: productFeedbackMentionsError } =
    await supabase
      .from("product_service_feedback")
      .select("*")
      .eq("location_id", location_id);

  // console.log("Product feedback mentions: ", productFeedbackMentions);

  if (productFeedbackMentionsError) {
    console.error(
      "Error fetching product/service feedback:",
      productFeedbackMentionsError
    );
    // Handle the error appropriately
  }

  // Process the product/service feedback data
  const productData = productFeedbackMentions.reduce((data, feedback) => {
    const itemName = feedback.item;
    const sentiment = feedback?.sentiment?.toLowerCase();

    if (!data[itemName]) {
      data[itemName] = { count: 0, positive: 0, negative: 0, mixed: 0 };
    }

    data[itemName].count++;
    data[itemName][sentiment]++;

    return data;
  }, {});

  const sortedProducts = Object.entries(productData)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  const top10Products = sortedProducts.slice(0, 10);

  const otherProductMentions = sortedProducts.slice(10).reduce(
    (sum, product) => ({
      count: sum.count + product.count,
      positive: sum.positive + product.positive,
      negative: sum.negative + product.negative,
      mixed: sum.mixed + product.mixed,
    }),
    { count: 0, positive: 0, negative: 0, mixed: 0 }
  );

  const productChartData = [
    ...top10Products.map((product, index) => ({
      item: product.name,
      mentions: product.count,
      positive: product.positive,
      negative: product.negative,
      mixed: product.mixed,
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    {
      item: "Other",
      mentions: otherProductMentions.count,
      positive: otherProductMentions.positive,
      negative: otherProductMentions.negative,
      mixed: otherProductMentions.mixed,
      fill: "hsl(var(--chart-100))",
    },
  ];

  const productChartConfig = {
    mentions: {
      label: "Mentions",
    },
    ...top10Products.reduce(
      (config, product, index) => ({
        ...config,
        [product.name]: {
          label: product.name,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      }),
      {}
    ),
    Other: {
      label: "Other",
      color: "hsl(var(--chart-7))",
    },
  };

  const { data: peoples_pains, error: peoples_pains_error } = await supabase
    .from("peoples_pains")
    .select("label, review_id")
    .eq("location_id", location_id);

  const { data: people_love, error: people_love_error } = await supabase
    .from("people_love")
    .select("label, review_id")
    .eq("location_id", location_id);

  const { data: people_hate, error: people_hate_error } = await supabase
    .from("people_hate")
    .select("label, review_id")
    .eq("location_id", location_id);

  const { data: people_dont_like, error: people_dont_like_error } =
    await supabase
      .from("people_dont_like")
      .select("label, review_id")
      .eq("location_id", location_id);

  const customersObservations = {
    peoplesPains: peoples_pains,
    peopleLove: people_love,
    peopleHate: people_hate,
    peopleDontLike: people_dont_like,
  };

  return (
    <Dashboard
      selectedLocation={location}
      ratingDistribution={ratingDistribution}
      sentimentDistribution={sentimentDistribution}
      staffChartData={staffChartData}
      staffChartConfig={staffChartConfig}
      productChartData={productChartData}
      productChartConfig={productChartConfig}
      customersObservations={customersObservations}
    />
  );
}
