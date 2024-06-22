// app/actions.js

"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/utils/supabaseClient";

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

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_").replace(/_+/g, "_");
}

export async function uploadFile(formData) {
  const file = formData.get("file");
  console.log("from uploadFile action: ", file);

  const sanitizedFileName = sanitizeFileName(file.name);

  try {
    const { data, error } = await supabase.storage
      .from("test")
      .upload(`public/${sanitizedFileName}`, file);

    // const { data, error } = await supabase.storage
    // .from("images")
    // .upload(`/${sanitizedFileName}`, file);

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
