// app/actions.js

"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
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

export async function updateSelectedLocation(locationObject) {
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("users")
    .update([
      {
        selected_location_id: locationObject.id,
      },
    ])
    .eq("clerk_id", userId);

  if (!error) {
    console.log("Selected location ID was updated successfully");
    return {
      message: "Selected location ID was updated successfully",
      success: true,
    };
  } else {
    console.log("Failed to update location ID");
    return { message: "Failed to update location ID", success: false };
  }
}

export async function fetchYelpReviewsRequest(formData) {
  console.log("Fetching reviews —> ", formData);

  const alias = formData.yelpBusinessLink.split("/").pop();
  const { userId } = await auth();

  try {
    // Initial request to get the total number of reviews
    const initialResponse = await postYelpReviewTask(alias, 10);
    const taskId = initialResponse.data.tasks[0].id;

    // Poll for results to get the total review count
    const initialResults = await pollYelpResults(taskId);
    const totalReviews = initialResults.totalReviews;

    // If there are more reviews, fetch all of them
    if (totalReviews > 10) {
      const fullResponse = await postYelpReviewTask(alias, totalReviews);
      const fullTaskId = fullResponse.data.tasks[0].id;
      const allReviews = await pollYelpResults(fullTaskId);

      // Save the Yelp profile URL
      // await saveYelpProfileUrl(userId, formData.yelpBusinessLink);

      console.log("More than 10 reviews");
      console.log(allReviews.reviews);

      return {
        success: true,
        reviews: allReviews.reviews,
        totalReviews: allReviews.totalReviews,
      };
    } else {
      // If 10 or fewer reviews, return the initial results
      // await saveYelpProfileUrl(userId, formData.yelpBusinessLink);

      console.log("Less or equal to 10 reviews");
      console.log(initialResults.reviews);

      return {
        success: true,
        reviews: initialResults.reviews,
        totalReviews: initialResults.totalReviews,
      };
    }
  } catch (error) {
    console.log(`Yelp fetching error —> `, error);
    return {
      success: false,
      message: "Failed to fetch Yelp reviews",
    };
  }
}

async function postYelpReviewTask(alias, depth) {
  return axios({
    method: "post",
    url: "https://api.dataforseo.com/v3/business_data/yelp/reviews/task_post",
    auth: {
      username: "0986881@lbcc.edu",
      password: "4045d2967d70b68e",
    },
    data: [
      {
        language_name: "English",
        alias: alias,
        depth: depth,
      },
    ],
    headers: { "content-type": "application/json" },
  });
}

async function pollYelpResults(taskId) {
  const maxAttempts = 10;
  const pollingInterval = 20000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios({
        method: "get",
        url: `https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/${taskId}`,
        auth: {
          username: "0986881@lbcc.edu",
          password: "4045d2967d70b68e",
        },
        headers: { "content-type": "application/json" },
      });

      if (response.data.tasks[0].status_code === 20000) {
        const result = response.data.tasks[0].result[0];
        return {
          success: true,
          reviews: result.items,
          totalReviews: result.reviews_count,
        };
      }
    } catch (error) {
      console.error("Error polling Yelp results:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  }

  throw new Error("Timeout while fetching Yelp reviews");
}

export async function fetchYelpReviews(formData) {
  try {
    await updateIsFetching(true);
    const workerUrl = "https://fetch-yelp-reviews.kuznetsov-dg495.workers.dev/";
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-cache",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, message: error.message };
  } finally {
    await updateIsFetching(false);
  }
}

export async function updateLocationAfterYelpFetch(formData) {
  const { userId } = await auth();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("selected_location_id")
    .eq("clerk_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return { success: false };
  }

  const { data: updatedLocation, error: errorLocation } = await supabase
    .from("locations")
    .update({
      yelp_profile_url: formData.yelpBusinessLink,
      is_yelp_configured: true,
    })
    .eq("id", userData.selected_location_id);

  if (!errorLocation) {
    console.log("Yelp is configured. Location is updated.");
    return { success: true };
  } else {
    console.error("Failed to update location:", errorLocation);
    return { success: false };
  }
}

export async function updateIsFetching(booleanState) {
  const { userId } = await auth();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("selected_location_id")
    .eq("clerk_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return { success: false };
  }

  const { error: updateError } = await supabase
    .from("locations")
    .update({ is_fetching: booleanState })
    .eq("id", userData.selected_location_id);

  if (!updateError) {
    console.log("Fetch state is updated");
    return { success: true };
  } else {
    console.error("Failed to update fetch state:", updateError);
    return { success: false };
  }
}
