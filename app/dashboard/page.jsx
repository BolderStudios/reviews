// app/dashboard/page.jsx

import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  return <Dashboard />;
}
