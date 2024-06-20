import Billing from "@/components/Billing";
import { currentUser } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  const user = await currentUser();
  const { data: userData, error } = await supabase
    .from("users")
    .select()
    .eq("clerk_id", user.id);

  const currentPriceId = userData[0].price_id;
  const emailAddress = user?.emailAddresses[0].emailAddress;

  console.log("Current Price Id:", currentPriceId);

  return (
    <Billing emailAddress={emailAddress} currentPriceId={currentPriceId} />
  );
}
