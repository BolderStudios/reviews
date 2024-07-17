// app/actions.js

"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "@/inngest/client";
import {
  updateIsFetching,
  updateFetchErrorMessage,
} from "@/utils/actionsHelpers";
import { redirect } from "next/navigation";

export async function createUsername(username) {
  console.log("from createUsername action: ", username);

  try {
    const { data, error } = await supabase
      .from("usernames")
      .insert([{ username }]);

    if (error) {
      console.error("Error inserting username: ", error);
      return { message: "Failed to add a username" };
    }

    revalidatePath("/");
    return { message: "Added username successfully", success: true };
  } catch (e) {
    console.error("Exception while adding username: ", e);
    return { message: "Failed to add a username", success: false };
  }
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}_${day}_${year}`;
}

function sanitizeFileName(
  fileName,
  label,
  userId,
  index = null,
  uploadType = "multiple",
  fileNamePrefix
) {
  const formattedDate = formatDate(new Date());
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
  const extension = fileName.split(".").pop(); // Get extension

  if (uploadType === "multiple") {
    const uniqueSuffix = uuidv4();
    if (index !== null) {
      return `${label}/${userId}/${fileNamePrefix}_${
        index + 1
      }_${formattedDate}_${uniqueSuffix}.${extension}`;
    }
    return `${label}/${userId}/${fileNamePrefix}_${formattedDate}.${extension}`;
  }

  // For single file uploads
  return `${label}/${userId}/${fileNamePrefix}_${formattedDate}.${extension}`;
}

export async function uploadFile(
  formData,
  label,
  index = null,
  uploadType = "multiple",
  fileNamePrefix = null
) {
  const { userId } = await auth();
  console.log(`User ID: ${userId}`);

  const file = formData.get("file");
  console.log(`Uploading file: ${file.name}`);

  const sanitizedFileName = sanitizeFileName(
    file.name,
    label,
    userId,
    index,
    uploadType,
    fileNamePrefix
  );
  console.log(`Sanitized file name: ${sanitizedFileName}`);

  try {
    if (uploadType === "multiple") {
      const { data, error } = await supabase.storage
        .from("test")
        .upload(`public/${sanitizedFileName}`, file);

      if (error) {
        console.error(`Upload error: ${error.message}`);
        return { message: "Failed to upload file", success: false };
      }

      console.log("File uploaded successfully");
      return {
        message: "Uploaded file successfully",
        success: true,
        file_name: file.name,
      };
    } else {
      // For single file uploads
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("test")
        .list(`public/${label}/${userId}`);

      if (listError) {
        console.error(`List error: ${listError.message}`);
        return { message: "Failed to list files", success: false };
      }

      console.log(
        `Existing files: ${existingFiles.map((file) => file.name).join(", ")}`
      );

      if (
        existingFiles.length > 1 ||
        (existingFiles[0]?.name !== ".emptyFolderPlaceholder" &&
          existingFiles.length === 1)
      ) {
        // Replace the existing file
        console.log("Replacing existing file");
        const { data, error } = await supabase.storage
          .from("test")
          .update(`public/${sanitizedFileName}`, file);

        if (error) {
          console.error(`Update error: ${error.message}`);
          return { message: "Failed to update file", success: false };
        }

        console.log("File updated successfully");
        return {
          message: "File updated successfully",
          success: true,
          file_name: file.name,
        };
      } else {
        // Upload the new file
        const { data, error } = await supabase.storage
          .from("test")
          .upload(`public/${sanitizedFileName}`, file);

        if (error) {
          console.error(`Upload error: ${error.message}`);
          return { message: "Failed to upload file", success: false };
        }

        console.log("File uploaded successfully");
        return {
          message: "Uploaded file successfully",
          success: true,
          file_name: file.name,
        };
      }
    }
  } catch (e) {
    console.error(`Exception: ${e.message}`);
    return { message: "Failed to upload file", success: false };
  }
}

export async function addLocationFunc(formData) {
  console.log("Adding location —> ", formData);
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId);

  const { data: addedLocation, error: addLocationError } = await supabase
    .from("locations")
    .insert([
      {
        user_id: data[0].id,
        clerk_id: userId,
        organization_name: formData.organizationName,
        name_of_contact: formData.nameOfContact,
        position_of_contact: formData.positionOfContact,
        is_primary: false,
      },
    ]);

  if (!error) {
    console.log("Location added successfully");
    return { message: "Location added successfully", success: true };
  } else {
    console.error("Error adding location: ", error);
    return { message: "Failed to add location", success: false };
  }
}

export async function updateSelectedLocation(locationObject, currentPathname) {
  try {
    const { userId } = await auth();

    const { data, error } = await supabase
      .from("users")
      .update({ selected_location_id: locationObject.id })
      .eq("clerk_id", userId);

    if (error) {
      throw error;
    }

    console.log("Selected location ID was updated successfully");
    console.log("Current pathname from backend: ", currentPathname);

    // Instead of redirecting, return the new path
    let newPath = "/";
    switch (currentPathname) {
      case "connections":
      case "reviews":
      case "dashboard":
      case "keywords":
      case "employee_mentions":
      case "product_feedback":
      case "review_us_page":
        newPath = `/${currentPathname}/${locationObject.id}`;
        break;
      case "billing":
        newPath = `/${currentPathname}`;
        break;
    }

    console.log("New path: ", newPath);

    return {
      message: "Selected location ID was updated successfully",
      success: true,
      newPath,
    };
  } catch (error) {
    console.error("Error updating selected location:", error);
    return {
      message: error.message || "Failed to update location ID",
      success: false,
    };
  }
}

export async function initiateYelpFetch(formData) {
  console.log("Form data —> ", formData);
  const { userId } = await auth();

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (userError) throw new Error("Failed to fetch user data");

    // Send event to Inngest
    await inngest.send({
      name: "fetch/yelp.reviews",
      data: {
        locationId: userData.selected_location_id,
        yelpBusinessLink: formData.yelpBusinessLink,
        clerkId: userId,
      },
    });

    return { success: true, message: "Yelp review fetch initiated" };
  } catch (error) {
    console.error("Error initiating Yelp fetch:", error);
    await updateFetchErrorMessage(error.message, userId);
    return { success: false, error: error.message };
  }
}

export async function getFetchStatus() {
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .select("is_fetching, fetch_error_message")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    console.error("Error fetching status:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function getLocationInfo(location_id) {
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  const { data: selectedLocation, error: selectedLocationError } =
    await supabase.from("locations").select("*").eq("id", location_id).single();

  const is_fetching = data.is_fetching;

  return { success: true, selectedLocation, is_fetching };
}

export async function getLocationData(location_id) {
  const { data: selectedLocation, error: selectedLocationError } =
    await supabase.from("locations").select("*").eq("id", location_id).single();

  return { success: true, selectedLocation };
}

export async function getLocations() {
  try {
    const { userId } = await auth();

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("clerk_id", userId)
      .single();

    if (error) throw error;

    let locations = [];
    let userSelectedLocation;

    if (data !== null) {
      const { data: userLocations, error: locationsError } = await supabase
        .from("locations")
        .select()
        .eq("user_id", data?.id);

      if (locationsError) throw locationsError;

      const { data: selectedLocation, error: selectedLocationError } =
        await supabase
          .from("locations")
          .select("*")
          .eq("id", data?.selected_location_id)
          .single();

      if (selectedLocationError) throw selectedLocationError;

      locations = userLocations;
      userSelectedLocation = selectedLocation;
    }

    return {
      success: true,
      locations,
      userSelectedLocation,
    };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { success: false, error: error.message };
  }
}

export async function isOnboardingCompleteFunc() {
  try {
    const { userId } = await auth();

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("clerk_id", userId)
      .single();

    if (error) throw error;

    const onboardingComplete = data?.is_onboarding_complete;

    return {
      success: true,
      onboardingComplete,
    };
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return { success: false, error: error.message };
  }
}
