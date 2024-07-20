// // "@/app/templates/standard/page.jsx"

// import supabase from "@/utils/supabaseClient";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export default async function Page() {
//   const { userId } = await auth();

//   const { data, error } = await supabase
//     .from("users")
//     .select("*")
//     .eq("clerk_id", userId)
//     .single();

//   return redirect(`/templates/standard/${data.selected_location_id}`);
// }

// "@/app/review_us_page/[location_id]/page.jsx"

import React from "react";
import StandardTemplate from "@/components/ui/StandardTemplate";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page() {
  
  return <StandardTemplate />;
}
