// components/CustomSignUp.jsx

"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader className="text-center flex flex-col gap-1">
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                      Welcome! Please fill in the details to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <Clerk.Field name="firstName" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>First Name</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="lastName" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Last Name</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="emailAddress" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email Address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                "Continue"
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                      <Button variant="link" size="sm" asChild>
                        <Link href="/sign-in">
                          Already have an account? Sign in
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader className="text-center flex flex-col gap-1">
                      <CardTitle>Verify your email</CardTitle>
                      <CardDescription>
                        Before continuing, could you verify your email address
                        by clicking on the link we just emailed to you? If you
                        didn't receive the email, we will gladly send you
                        another.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code" className="space-y-2">
                        <Clerk.Input
                          type="otp"
                          className="flex justify-center has-[:disabled]:opacity-50"
                          autoSubmit
                          render={({ value, status }) => (
                            <div
                              data-status={status}
                              className={cn(
                                "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                {
                                  "z-10 ring-2 ring-ring ring-offset-background":
                                    status === "cursor" ||
                                    status === "selected",
                                }
                              )}
                            >
                              {value}
                              {status === "cursor" && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                  <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                </div>
                              )}
                            </div>
                          )}
                        />
                        <Clerk.FieldError className="block text-sm text-destructive text-center" />
                      </Clerk.Field>

                      <SignUp.Action
                        asChild
                        resend
                        fallback={({ resendableAfter }) => (
                          <Button
                            variant="link"
                            size="sm"
                            disabled={resendableAfter !== 0}
                            className={cn("cursor-pointer text-stone-900", {
                              "cursor-not-allowed text-muted-foreground":
                                resendableAfter !== 0,
                            })}
                          >
                            Didn&apos;t receive a code? Resend (
                            <span className="tabular-nums">
                              {resendableAfter}
                            </span>
                            )
                          </Button>
                        )}
                      >
                        <Button variant="link" size="sm">
                          Didn&apos;t receive a code? Resend
                        </Button>
                      </SignUp.Action>
                    </CardContent>

                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  "Verify"
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardFooter>

                    <div className="flex items-center justify-center pb-4">
                      <Button variant="link" size="sm" asChild>
                        <Link href="/sign-in">
                          Already have an account? Sign in
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </SignUp.Strategy>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  );
}
