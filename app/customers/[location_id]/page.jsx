// "@/app/customers/[location_id]/page.jsx"

import React from "react";
import Customers from "@/components/ui/Customers/Customers";
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

  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("*")
    .eq("location_id", location_id)
    .order("created_at", { ascending: false });

  return <h1>Customers Table</h1>;

  //   return <Customers selectedLocation={location} customers={customers} />;
}
