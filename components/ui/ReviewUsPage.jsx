import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";

export default function ReviewUsPage({ selectedLocation, isFetching }) {
  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">Templates</h2>

        <div>
          <Card className="w-[250px] p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md">Standard</CardTitle>
                <Link href={`/templates/standard/${selectedLocation.id}`}>
                  <ExternalLink className="text-blue-500 w-4 h-4">
                    Preview
                  </ExternalLink>
                </Link>
              </div>
              <CardDescription className="text-sm text-gray-500">
                This is the most used template. Click blue icon to preview.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </SignedInLayout>
  );
}
