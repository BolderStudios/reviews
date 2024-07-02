"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [emailId, setEmailId] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    if (email === "") {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      const emailCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        const { emailAddressId } = emailCodeFactor;
        setEmailId(emailAddressId);

        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });

        setVerifying(true);
        toast.success("Verification code sent to your email.");
      } else {
        toast.error("Email code strategy is not supported.");
        setError("Email code strategy is not supported.");
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      if (err.errors && err.errors[0].code === "form_identifier_not_found") {
        toast.error("Account not found. Please try again.");
      } else if (
        err.errors &&
        err.errors[0].code === "form_password_incorrect"
      ) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Enter a valid email address.");
      }
      setError("Failed to start the sign-in process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerification(e) {
    e.preventDefault();

    if (!isLoaded || !signIn) return;

    if (code === "") {
      toast.error("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        toast.success("Successfully signed in!");
        await setActive({ session: signInAttempt.createdSessionId });

        router.push("/onboarding");
        // router.refresh();
      } else {
        console.error(signInAttempt);
        toast.error("Verification failed. Please try again.");
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      if (err.errors && err.errors[0].code === "form_code_incorrect") {
        toast.error("Incorrect verification code. Please try again.");
      } else {
        toast.error("Verification failed. Please try again.");
      }
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    if (!isLoaded || !signIn) return;

    try {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailId,
      });
      toast.success("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Error resending OTP:", JSON.stringify(err, null, 2));
      toast.error("Failed to resend verification code. Please try again.");
      setError("Failed to resend verification code. Please try again.");
    }
  }

  return (
    <>
      {verifying ? (
        <>
          <div className="w-screen h-screen relative flex items-center justify-center">
            {/* Go Back button */}
            <div className="absolute top-4 left-4">
              <Button asChild variant="outline">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-[6px]"
                >
                  <ArrowLeft size={14} className="mt-[1px]" />
                  <p className="leading-7">Back to Homepage</p>
                </Link>
              </Button>
            </div>

            {/* Main sign in component */}
            <div className="w-[400px] py-6 px-8">
              <div className="flex flex-col text-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
                  Verification Required
                </h4>
                <p className="leading-5 text-stone-700">
                  We have sent a verification code to your email address. Please
                  enter the code to verify your email address.
                </p>
              </div>

              <div className="mt-6 text-center">
                <Form {...form}>
                  <form onSubmit={handleVerification}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      {isLoading ? (
                        <ButtonLoading
                          size="lg"
                          width="w-full"
                          content="Verifying code ..."
                        />
                      ) : (
                        <Button type="submit" size="lg" className="w-full">
                          Verify
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>

                <Button
                  variant="link"
                  className="text-sm mt-4"
                  onClick={handleResendOTP}
                >
                  Resend OTP code
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-screen h-screen relative flex items-center justify-center">
            {/* Go Back button */}
            <div className="absolute top-4 left-4">
              <Button asChild variant="outline">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-[6px]"
                >
                  <ArrowLeft size={14} className="mt-[1px]" />
                  <p className="leading-7">Back to Homepage</p>
                </Link>
              </Button>
            </div>

            {/* Main sign in component */}
            <div className="w-[400px] py-6 px-8">
              <div className="flex flex-col text-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
                  Login
                </h4>
                <p className="leading-5 text-stone-700">
                  Welcome back! Please use your email address to sign in.
                </p>
              </div>

              <div className="mt-6">
                <Form {...form}>
                  <form onSubmit={handleSubmit}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">Email address</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      {isLoading ? (
                        <ButtonLoading
                          size="lg"
                          width="w-full"
                          content="Sending code ..."
                        />
                      ) : (
                        <Button type="submit" size="lg" className="w-full">
                          Continue
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>

                <div className="text-center">
                  <Button variant="link" className="text-sm mt-4">
                    <Link href="/sign-up">Don't have an account? Sign up.</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
