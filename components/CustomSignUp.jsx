"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Start the sign-up process using the email address method
      await signUp.create({
        emailAddress: email,
        firstName,
        lastName,
      });

      // Start the verification - an email message will be sent to the
      // email address with a one-time code
      await signUp.prepareEmailAddressVerification();

      // Set verifying to true to display second form and capture the OTP code
      setVerifying(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function handleResendOTP() {
    if (!isLoaded && !signUp) return null;

    try {
      // Resend the verification email
      await signUp.prepareEmailAddressVerification();
      setError("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Error resending OTP:", JSON.stringify(err, null, 2));
      setError("Failed to resend verification code. Please try again.");
    }
  }

  async function handleVerification(e) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        router.push("/onboarding");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your email number</h1>
        <form onSubmit={handleVerification}>
          <label htmlFor="code">Enter your verification code</label>
          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="text-center text-sm">
              {value === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {value}</>
              )}
            </div>
          </div>

          <button type="submit">Verify</button>
        </form>
        <button className="mt-4" onClick={handleResendOTP}>
          Resend OTP code
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">Enter first name</label>
        <input
          value={firstName}
          id="firstName"
          name="firstName"
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Enter last name</label>
        <input
          value={lastName}
          id="lastName"
          name="lastName"
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="email">Enter email address</label>
        <input
          value={email}
          id="email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Continue</button>
      </form>
    </>
  );
}
