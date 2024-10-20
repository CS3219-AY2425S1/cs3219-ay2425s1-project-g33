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
import { login, requestSSOUrl } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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

const FormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Must be a valid email format"),
  password: z.string().min(1, "Password is required"),
});

export default function SigninForm() {
  const router = useRouter();

  const { toast } = useToast();

  const [isSSORedirecting, setIsSSORedirecting] = useState<boolean>(false);

  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
    async (data: z.infer<typeof FormSchema>) => {
      if (formState.isSubmitting || isSSORedirecting) return;
      const accessTokenResponse = await login(data);
      if (accessTokenResponse.statusCode === 200 && accessTokenResponse.data) {
        toast({
          title: "Successfully Logged in!",
          description: "You should be redirect to /dashboard",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error!",
          description: accessTokenResponse.message,
        });
      }
    },
    [router, toast, formState.isSubmitting, isSSORedirecting]
  );

  return (
    <Card className="p-2 mt-3">
      <CardHeader>
        <CardTitle className="text-xl">Welcome!</CardTitle>
        <CardDescription className="text-card-foreground-100">
          Log in to start coding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {/* To input log in details */}
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                {/* Email Field */}
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
              </div>

              {/* Forgot password link */}
              <div className="pt-2 pb-2 text-right">
                <Link href="/forgotpassword/sendmail" className="text-sm text-primary hover:underline">
                  {" "}
                  Forgot password?{" "}
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={formState.isSubmitting || isSSORedirecting}
                className="w-full py-2 mt-5 rounded-md bg-primary"
              >
                {formState.isSubmitting || isSSORedirecting ? (
                  <LoadingSpinner />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          {/* Or sign in with */}
          <div className="flex items-center my-6">
            <Separator className="flex-1 h-[0.5px] bg-card-foreground-100" />
            <span className="mx-2 text-sm">Or sign in with</span>
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
              No account yet? Click here to{" "}
              <Link
                href="/auth/signup"
                className="hover:underline text-primary"
              >
                Sign up
              </Link>{" "}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
