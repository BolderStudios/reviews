import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  console.log("Page not found from app/not-found.js");

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-red-50 z-40">
      <h1>404 - Page Not Found — /not-found route</h1>

      <Button variant="link" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
