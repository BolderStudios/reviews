// app/actions.js

"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/utils/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

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
