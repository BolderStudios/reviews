// @/components/ui/ClientRedirect.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ClientRedirect({ redirect_url }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    router.push(redirect_url);
    setIsLoaded(true);
  }, [redirect_url, router]);

  return isLoaded ? <LoadingSpinner /> : null;
}