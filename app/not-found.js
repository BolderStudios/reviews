import { redirect } from "next/navigation";

export default function NotFound() {
  console.log("Page not found from app/not-found.js");

  return redirect("/not-found");
}
