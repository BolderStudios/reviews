// app/file-upload/page.jsx

import React from "react";
import { SingleFileUploader } from "@/components/ui/Misc/SingleFileUploader";
import { MultipleFileUploader } from "@/components/ui/Misc/MultipleFileUploader";
import { DialogUploader } from "@/components/ui/Misc/DialogUploader";

export default function Page() {
  return (
    <div className="px-8 py-4 flex flex-col ">
      <SingleFileUploader />

      <div className="grid grid-cols-2 mt-12">
        <div className="">
          <MultipleFileUploader />
        </div>

        <div className="flex items-center justify-center">
          <DialogUploader />
        </div>
      </div>
    </div>
  );
}
