// "@/app/web-forms/page.jsx"

import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  return redirect(`/web-forms/${data.selected_location_id}`);
}
