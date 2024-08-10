// @/components/ui/ClientRedirect.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ClientRedirect({ redirect_url }) {
  const router = useRouter();

  useEffect(() => {
    router.push(redirect_url);
  }, [redirect_url, router]);

  return <LoadingSpinner />;
}