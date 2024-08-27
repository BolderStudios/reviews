// [location_id]/page.js

import { usePathname, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const validSubdomainRoutes = [
  "/",
  "/dashboard",
  "/billing",
  "/file-uploader",
  "/form",
  "/onboarding",
  "/connections",
  "/reviews",
  "/keywords",
  "/employee_mentions",
  "/product_feedback",
  "/review_us_page",
  "/templates",
];

export default async function Home() {
  const pathname = usePathname();

  if (!validSubdomainRoutes.includes(pathname)) {
    notFound();
  }

  const { userId } = await auth();

  if (!userId) {
    console.log("No userId, redirecting to sign-in");
    redirect("localhost:3000/sign-in");
  }

  return (
    <div>
      {/* <Header /> */}
      <h1>Subdomain for www.getbrandarmor.com</h1>
    </div>
  );
}
