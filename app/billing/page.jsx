import Billing from "@/components/Billing";
import { currentUser } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  const user = await currentUser();
  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id);

  const supabase_user_id = userData[0].id;

  const { data: subscriptionData, error: subscriptionDataError } =
    await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", supabase_user_id)
      .neq("subscription_status", "deleted");

  const currentPriceId = subscriptionData[0]?.stripe_price_id;
  const emailAddress = user?.emailAddresses[0].emailAddress;

  console.log("Current Price Id:", currentPriceId);

  return (
    <Billing emailAddress={emailAddress} currentPriceId={currentPriceId} />
  );
}
