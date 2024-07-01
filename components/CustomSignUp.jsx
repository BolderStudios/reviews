"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function handleSubmit(data) {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await signUp.prepareEmailAddressVerification();
      setVerifying(true);
      setEmail(data.email);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      toast.error("User already exists. Please sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerification(e) {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    if (code === "") {
      toast.error("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        toast.success("Account created successfully!");

        // Manually set the user as signed in after navigation
        router.replace("/onboarding").then(() => {
          setIsSignedIn(true);
        });
        // router.push("/onboarding");
        // router.refresh();
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      if (err.errors && err.errors[0].code === "form_code_incorrect") {
        toast.error("Incorrect verification code. Please try again.");
      } else {
        // toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification();
      toast.success("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Error resending OTP:", JSON.stringify(err, null, 2));
      toast.error("Failed to resend verification code. Please try again.");
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

            {/* Main sign up component */}
            <div className="w-[400px] py-6 px-8">
              <div className="flex flex-col text-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
                  Verification Required
                </h4>
                <p className="leading-5 text-stone-700">
                  We have sent a verification code to {email}. Please enter the
                  code to verify your email address.
                </p>
              </div>

              <div className="mt-6 text-center">
                <form onSubmit={handleVerification}>
                  <div className="flex items-center justify-center">
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
                  </div>

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

            {/* Main sign up component */}
            <div className="w-[400px] py-6 px-8">
              <div className="flex flex-col text-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-stone-900">
                  Sign Up
                </h4>
                <p className="leading-5 text-stone-700">
                  Create an account to get started.
                </p>
              </div>

              <div className="mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                      // Display toast for each error
                      Object.values(errors).forEach((error) => {
                        toast.error(error.message);
                      });
                    })}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex gap-8">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="firstName"
                              className="text-foreground"
                            >
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="firstName"
                                placeholder="Enter first name"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="lastName"
                              className="text-foreground"
                            >
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="lastName"
                                placeholder="Enter last name"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="email"
                            className="text-foreground"
                          >
                            Email address
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      {isLoading ? (
                        <ButtonLoading
                          size="lg"
                          width="w-full"
                          content="Creating account ..."
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
                    <Link href="/sign-in">
                      Already have an account? Sign in.
                    </Link>
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
