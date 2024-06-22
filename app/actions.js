// app/actions.js

"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";

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

// sanitizeFileName function
function sanitizeFileName(fileName, label, userId, index = null) {
  const date = new Date().toISOString().slice(0, 10).split("-");
  const formattedDate = `${date[1]}_${date[2]}_${date[0]}`;
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
  const extension = fileName.split(".").pop(); // Get extension

  if (index !== null) {
    // console.log("New file name");
    // console.log(`${label}_${index}_${formattedDate}_${userId}.${extension}`);

    return `${label}/${userId}/file_${
      index + 1
    }_${formattedDate}_.${extension}`;
  }

  // console.log("New file name");
  // console.log(`${label}_${formattedDate}_${userId}.${extension}`);
  return `${label}_${formattedDate}_${userId}.${extension}`;
}

export async function uploadFile(formData, label, index = null) {
  const { userId } = await auth();
  console.log("User ID: ", userId);

  const file = formData.get("file");
  console.log("from uploadFile action: ", file);

  const sanitizedFileName = sanitizeFileName(file.name, label, userId, index);

  try {
    const { data, error } = await supabase.storage
      .from("test")
      .upload(`public/${sanitizedFileName}`, file);

    if (error) {
      console.error("Error uploading file: ", error);
      return { message: "Failed to upload file", success: false };
    }

    return { message: "Uploaded file successfully", success: true };
  } catch (e) {
    console.error("Exception while uploading file: ", e);
    return { message: "Failed to upload file", success: false };
  }
}
