// components/CustomSignIn.jsx

"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
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

export default function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader className="text-center flex flex-col gap-1">
                    <CardTitle>Sign in to Brand Armor</CardTitle>
                    <CardDescription>
                      Welcome back! Please sign in to continue
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid gap-y-4">
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>

                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
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
                      </SignIn.Action>

                      <Button variant="link" size="sm" asChild>
                        <Link href="/sign-up">
                          Don&apos;t have an account? Sign up
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader className="text-center flex flex-col gap-1">
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Before continuing, could you verify your email address
                        by clicking on the link we just emailed to you? If you
                        didn't receive the email, we will gladly send you
                        another.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-y-4 mt-2">
                      <Clerk.Field name="code">
                        <Clerk.Label className="sr-only">
                          Email verification code
                        </Clerk.Label>
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

                      <SignIn.Action
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
                      </SignIn.Action>
                    </CardContent>

                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
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
                        </SignIn.Action>

                        <Button variant="link" size="sm" asChild>
                          <Link href="/sign-up">
                            Don't have an account? Sign up
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}
