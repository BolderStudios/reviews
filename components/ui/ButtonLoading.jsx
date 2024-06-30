// components/ui/ButtonLoading.jsx

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({
  width = "",
  size = "default",
  content = "Please wait",
}) {
  return (
    <Button disabled size={size} className={`${width}`}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {content}
    </Button>
  );
}
