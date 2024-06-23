// app/file-upload/page.jsx

import React from "react";
import { SingleFileUploader } from "@/components/ui/SingleFileUploader";
import { MultipleFileUploader } from "@/components/ui/MultipleFileUploader";

export default function Page() {
  return (
    <div className="px-8 py-4">
      {/* <SingleFileUploader /> */}
      <MultipleFileUploader />
    </div>
  );
}
