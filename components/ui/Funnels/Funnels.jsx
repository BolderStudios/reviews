"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink, QrCode } from "lucide-react";
import { SignedInLayout } from "@/app/layouts/SignedInLayout";
import { generateQRCode } from "@/app/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Funnels({ selectedLocation, isFetching }) {
  let subdomain;
  let href_qr;
  let href_campaign;

  if (process.env.NEXT_PUBLIC_REDIRECT_URL.startsWith("localhost")) {
    subdomain = `${selectedLocation.id}.${process.env.NEXT_PUBLIC_REDIRECT_URL}`;
    href_qr = `www.${subdomain}/templates/standard/yelp/qr-code`;
    href_campaign = `www.${subdomain}/templates/standard/yelp/campaign/test_customer_id`;
  } else {
    subdomain = `${selectedLocation.id}.${process.env.NEXT_PUBLIC_REDIRECT_URL}`;
    href_qr = `https://${subdomain}/templates/standard/yelp/qr-code`;
    href_campaign = `https://${subdomain}/templates/standard/yelp/campaign/test_customer_id`;
  }

  const handleQRCodeClick = async () => {
    const result = await generateQRCode();

    if (result.success) {
      // Create a temporary anchor element
      const downloadLink = document.createElement("a");
      downloadLink.href = result.qrURL;
      downloadLink.download = "qrcode.png";

      // Append to the document body temporarily
      document.body.appendChild(downloadLink);

      // Programmatically click the link to trigger the download
      downloadLink.click();

      // Remove the link from the document
      document.body.removeChild(downloadLink);
    } else {
      console.error("Failed to generate QR code:", result.error);
    }
  };

  return (
    <SignedInLayout>
      <div className="px-8 py-6">
        <h2 className="font-bold text-2xl mb-6">Templates</h2>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Standard Yelp QR Code Card */}
          <Card className="w-[250px] p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md">Yelp QR-code</CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <QrCode
                          onClick={handleQRCodeClick}
                          className="text-stone-600 w-4 h-4 cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate a QR-code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={href_qr} target="_blank">
                          <ExternalLink className="text-stone-600 w-4 h-4">
                            Preview
                          </ExternalLink>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Preview template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription className="text-sm">
                Use this template for QR-code scanning at your location.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Standard Yelp Campaign Code Card */}
          <Card className="w-[250px] p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-md">Yelp Campaign</CardTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={href_campaign} target="_blank">
                          <ExternalLink className="text-stone-600 w-4 h-4">
                            Preview
                          </ExternalLink>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Preview template</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription className="text-sm">
                Use this template for QR-code scanning at your location.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </SignedInLayout>
  );
}
