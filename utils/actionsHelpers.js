import supabase from "@/utils/supabaseClient";

export async function updateIsFetching(booleanState, clerkId) {
  console.log("Updating fetch state to:", booleanState);
  console.log("User ID: ", clerkId);

  const { data: updatedUser, error: updatedUserError } = await supabase
    .from("users")
    .update({ is_fetching: booleanState })
    .eq("clerk_id", clerkId);

  if (updatedUserError) {
    console.error("Error updating user fetch state:", updatedUserError);
    return { success: false };
  }

  return { success: true };
}

export async function updateFetchErrorMessage(errorMessage, clerkId) {
  console.log("Updating fetch error message to:", errorMessage);
  console.log("User ID: ", clerkId);

  const { error } = await supabase
    .from("users")
    .update({ fetch_error_message: errorMessage })
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("Error updating fetch error message:", error);
    return { success: false };
  }

  return { success: true };
}

export async function getLocationInfo(locationId) {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", locationId)
    .single();

  if (error) {
    console.error("Error fetching location info:", error);
    return { success: false };
  }

  return { success: true, data };
}
