// app/file-upload/page.jsx

import React from "react";
import { SingleFileUploader } from "@/components/ui/SingleFileUploader";
import { MultipleFileUploader } from "@/components/ui/MultipleFileUploader";
import { DialogUploader } from "@/components/ui/DialogUploader";

export default function Page() {
  return (
    <div className="px-8 py-4">
      <SingleFileUploader />

      {/* <div className="max-w-[400px]">
        <MultipleFileUploader />
      </div>

      <DialogUploader /> */}
    </div>
  );
}
