// components/ui/ButtonCustomerPortal.jsx

"use client";

import { Button } from "./button";
import Link from "next/link";

const customerPortalLink = `${process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_LINK}`;

console.log("customerPortalLink", customerPortalLink);

const ButtonCustomerPortal = ({ emailAddress }) => {
  return (
    <Button asChild className="w-full">
      <Link href={customerPortalLink + "?prefilled_email=" + emailAddress}>
        Manage Subscriptions
      </Link>
    </Button>
  );
};

export default ButtonCustomerPortal;
