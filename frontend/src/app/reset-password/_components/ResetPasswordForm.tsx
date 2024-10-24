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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmResetPassword, verifyCode } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { TextInput } from "@/components/form/TextInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Lock } from "lucide-react";
import { useCallback } from "react";

const FormSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { handleSubmit, formState } = methods;

  const token = searchParams.get("token");

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (!token) {
        toast({ title: "Error!", description: "Invalid token." });
        return;
      }

      try {
        const verificationResponse = await verifyCode(token);

        if (verificationResponse.statusCode === 201) {
          const resetPasswordResponse = await confirmResetPassword(
            token,
            data.newPassword
          );

          if (resetPasswordResponse.statusCode === 201) {
            toast({
              title: "Success!",
              description: "Your password has been reset.",
            });
            router.push("/forgotpassword/passwordupdated");
          } else {
            toast({
              title: "Error!",
              description: resetPasswordResponse.message,
            });
          }
        } else {
          toast({ title: "Error!", description: verificationResponse.message });
        }
      } catch (error) {
        toast({
          title: "Error!",
          description: "An error occurred. Please try again.",
        });
      }
    },
    [router, toast, token]
  );

  return (
    <Card className="p-2 mt-3">
      <CardHeader>
        <CardTitle className="text-xl">Set new password</CardTitle>
        <CardDescription className="text-card-foreground-100">
          Please set your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <TextInput
                  label={""}
                  name="newPassword"
                  placeholder="New Password"
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
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full py-2 mt-5 rounded-md bg-primary"
              >
                {formState.isSubmitting ? <LoadingSpinner /> : "Reset Password"}
              </Button>
            </form>
          </Form>
          <div className="justify-center mt-6 text-sm text-center">
            <p>
              Back to{" "}
              <Link
                href="/auth/signin"
                className="hover:underline text-primary"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
