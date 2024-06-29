"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    setError("");

    try {
      // Start the sign-in process using the email address method
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Filter the returned array to find the 'email_code' entry
      const emailCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        // Grab the emailAddressId
        const { emailAddressId } = emailCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });

        // Set verifying to true to display second form
        // and capture the OTP code
        setVerifying(true);
      } else {
        setError("Email code strategy is not supported.");
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError("Failed to start the sign-in process. Please try again.");
    }
  }

  async function handleVerification(e) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        router.push("/");
        router.refresh();

        // This is a workaround to refresh the page after sign-in
        // setTimeout(() => {
        //   window.location.reload();
        // }, 100);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signInAttempt);
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError("Verification failed. Please try again.");
    }
  }

  return (
    <>
      {verifying ? (
        <>
          <h1>Verify your email address</h1>
          <form onSubmit={handleVerification}>
            <label htmlFor="code">Enter your verification code</label>
            <input
              value={code}
              id="code"
              name="code"
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit">Verify</button>
          </form>
        </>
      ) : (
        <>
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
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
      )}
      {error && <p>{error}</p>}
    </>
  );
}
