import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Buttons/button";
import { MultipleFileUploader } from "@/components/ui/Misc/MultipleFileUploader";

export function DialogUploader() {
  return (
    <Dialog>
      <Button variant="outline" asChild>
        <DialogTrigger>Open File Uploader</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload files here</DialogTitle>
          <DialogDescription>
            Select and upload the files of your choice
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <MultipleFileUploader />
        </div>
      </DialogContent>
    </Dialog>
  );
}
