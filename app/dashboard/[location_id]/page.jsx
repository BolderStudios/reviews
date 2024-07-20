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

  return <Dashboard selectedLocation={location} />;
}
