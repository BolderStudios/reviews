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

    if (!isLoaded || !signUp) return;

    try {
      await signUp.create({
        emailAddress: email,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification();
      setVerifying(true);
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  async function handleResendOTP() {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification();
      setError("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Error resending OTP:", JSON.stringify(err, null, 2));
      setError("Failed to resend verification code. Please try again.");
    }
  }

  async function handleVerification(e) {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    try {
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        
        router.push("/onboarding");
      } else {
        console.error(signInAttempt);
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
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
              {code === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {code}</>
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
