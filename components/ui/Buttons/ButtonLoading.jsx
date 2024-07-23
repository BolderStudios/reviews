// components/ui/ButtonLoading.jsx
import React from 'react';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Buttons/button";

export const ButtonLoading = React.forwardRef(({
  width = "",
  size = "default",
  content = "Please wait",
  ...props
}, ref) => {
  return (
    <Button disabled size={size} className={`${width}`} ref={ref} {...props}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {content}
    </Button>
  );
});

ButtonLoading.displayName = 'ButtonLoading';