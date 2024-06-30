import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-col h-full">
      <h1>404 - Page Not Found — /not-found route</h1>

      <Button variant="link" asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}