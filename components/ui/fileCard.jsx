import { useRef } from "react";
import { X, MicrosoftExcelLogo } from "@phosphor-icons/react";
import { toast } from "sonner";

export function FileCard({ file, setFiles, isLoading }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className="border border-stone-200 flex justify-between px-3 py-3 rounded-lg w-[400px] animate-file-add-up"
    >
      <div className="flex gap-2">
        <div className="flex items-center justify-center">
          <MicrosoftExcelLogo
            color="green"
            weight="duotone"
            className="w-9 h-9"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-regular text-sm">{file.name}</p>
          <p className="text-stone-500 text-xs">
            {Math.round(file.size / 1024)} KB
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          toast.message("File is removed from the list");
          ref.current.classList.add(
            "-translate-y-1",
            "opacity-0",
            "ease-out",
            "duration-300"
          );
          setTimeout(() => {
            setFiles((prevFiles) => prevFiles.filter((f) => f !== file)); // Change here to compare objects or IDs
          }, 300);
        }}
        className={`h-fit rounded-md p-[1px] hover:bg-stone-100 transition-all ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <X className="w-4 h-4 text-stone-500" />
      </div>
    </div>
  );
}
