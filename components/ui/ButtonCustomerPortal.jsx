"use client";

const customerPortalLink =
  "https://billing.stripe.com/p/login/test_eVabMgg37dRm7Ty288";

const ButtonCustomerPortal = ({ emailAddress }) => {
  return (
    <a
      href={customerPortalLink + "?prefilled_email=" + emailAddress}
      className="btn"
    >
      Go to Customer Portal
    </a>
  );
};

export default ButtonCustomerPortal;