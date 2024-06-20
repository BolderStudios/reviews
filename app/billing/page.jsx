import Billing from "@/components/Billing";
import { currentUser } from "@clerk/nextjs/server";
import supabase from "@/utils/supabaseClient";

export default async function Page() {
  const user = await currentUser();
  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id);

  console.log("userData: ", userData);

  let currentPriceId = "";
  let emailAddress = "";
  let supabase_user_id = "";

  if (userData.length !== 0) {
    supabase_user_id = userData[0]?.id;

    const { data: subscriptionData, error: subscriptionDataError } =
      await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", supabase_user_id)
        .neq("subscription_status", "deleted");

    currentPriceId = subscriptionData[0]?.stripe_price_id;
    emailAddress = user?.emailAddresses[0].emailAddress;
  }

  if (userDataError) {
    console.error("Error fetching user data:", userDataError);
    throw new Error(userDataError.message);
  }

  console.log("Current Price Id:", currentPriceId);
  console.log("Email Address:", emailAddress);

  return (
    <Billing emailAddress={emailAddress} currentPriceId={currentPriceId} />
  );
}
