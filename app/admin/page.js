// [location_id]/page.js

"use client";

import { usePathname, notFound } from "next/navigation";

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

export default function Home() {
  const pathname = usePathname();

  if (!validSubdomainRoutes.includes(pathname)) {
    notFound();
  }

  return (
    <div>
      {/* <Header /> */}
      <h1>Subdomain for www.getbrandarmor.com</h1>
    </div>
  );
}
