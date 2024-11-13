"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { useCallback, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestSSOUrl, signup } from "@/services/authService";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/form/TextInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import GoogleIconSvg from "@public/assets/icons/google.svg";
import GithubIconSvg from "@public/assets/icons/github.svg";
import { AccountProvider, AccountProviderEnum } from "@/types/AccountProvider";
import { Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignupFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email({ message: "Must be a valid email format" }),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const router = useRouter();

  const { toast } = useToast();

  const [isSSORedirecting, setIsSSORedirecting] = useState<boolean>(false);

  const methods = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {},
  });

  const { handleSubmit, formState } = methods;

  const handleSSOButtonClick = useCallback(
    async (provider: AccountProvider) => {
      setIsSSORedirecting(true);
      const resUrl = await requestSSOUrl(provider);
      if (resUrl.data) {
        window.location.href = resUrl.data;
      } else {
        toast({
          title: "Error!",
          description: "Social sign in error, try again later.",
        });
        setIsSSORedirecting(false);
      }
    },
    [toast]
  );

  const onSubmit = useCallback(
    async (data: z.infer<typeof SignupFormSchema>) => {
      if (formState.isSubmitting || isSSORedirecting) return;
      if (data.password !== data.confirmPassword) {
        methods.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match.",
        });
        return;
      }
      const accessTokenResponse = await signup(data);
      if (accessTokenResponse.statusCode === 200 && accessTokenResponse.data) {
        toast({
          title: "Success!",
          description: "You should be redirected to /onboard",
        });
        router.push("/onboard");
      } else {
        toast({
          title: "Error!",
          description: accessTokenResponse.message,
        });
      }
    },
    [router, methods, formState.isSubmitting, isSSORedirecting, toast]
  );

  return (
    <Card className="p-2 mt-3">
      <CardHeader>
        <CardTitle className="text-xl">Sign up</CardTitle>
        <CardDescription className="text-card-foreground-100">
          Join PeerPrep today and start your journey toward acing tech
          interviews!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="flex flex-col gap-y-4">
                <TextInput
                  label={""}
                  name="email"
                  type="email"
                  placeholder="Email"
                  Icon={Mail}
                  className="bg-input-background-100"
                />
                <TextInput
                  label={""}
                  name="password"
                  placeholder="Password"
                  type="password"
                  Icon={Lock}
                  className="bg-input-background-100"
                />
                <TextInput
                  label={""}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  Icon={Lock}
                  className="bg-input-background-100"
                />
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={formState.isSubmitting || isSSORedirecting}
                className="w-full py-2 rounded-md mt-7 bg-primary"
              >
                {formState.isSubmitting || isSSORedirecting ? (
                  <LoadingSpinner />
                ) : (
                  "Get started"
                )}
              </Button>
            </form>
          </Form>

          {/* Or sign in with */}
          <div className="flex items-center my-6">
            <Separator className="flex-1 h-[0.5px] bg-card-foreground-100" />
            <span className="mx-2 text-sm">Or sign up with</span>
            <Separator className="flex-1 h-[0.5px] bg-card-foreground-100" />
          </div>

          {/* Socials */}
          <div className="flex flex-row justify-center gap-x-4">
            <Button
              disabled={formState.isSubmitting || isSSORedirecting}
              variant="soft"
              size="icon"
              onClick={() =>
                handleSSOButtonClick(AccountProviderEnum.enum.github)
              }
            >
              <Image
                src={GithubIconSvg}
                alt="Github icon"
                width={20}
                height={20}
                className="w-5 h-5 stroke-primary fill-primary"
              />
            </Button>
            <Button
              disabled={formState.isSubmitting || isSSORedirecting}
              variant="soft"
              size="icon"
              onClick={() =>
                handleSSOButtonClick(AccountProviderEnum.enum.google)
              }
            >
              <Image
                src={GoogleIconSvg}
                alt="Google icon"
                width={20}
                height={20}
                className="w-5 h-5 stroke-primary fill-primary"
              />
            </Button>
          </div>

          {/* Sign up here */}
          <div className="justify-center mt-6 text-sm text-center">
            <p>
              {" "}
              Already have an account? Click here to{" "}
              <Link
                href="/auth/signin"
                className="hover:underline text-primary"
              >
                Sign in
              </Link>{" "}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
