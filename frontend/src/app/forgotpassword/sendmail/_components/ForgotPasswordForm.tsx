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

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/services/authService";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/form/TextInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await resetPassword(data.email);

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast({
          title: "Success!",
          description:
            "A link has been sent to your email to reset your password.",
        });
        router.push("/forgotpassword/sendmail");
      } else {
        toast({
          title: "Error!",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error during reset password:", error);

      toast({
        title: "Error!",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-2 mt-3">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password?</CardTitle>
        <CardDescription className="text-card-foreground-100">
          No worries we’ll send you reset instructions.
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
              </div>

              {/* Reset Password Button */}
              <Button
                type="submit"
                disabled={formState.isSubmitting || isSubmitting}
                className="w-full py-2 mt-5 rounded-md bg-primary"
              >
                {formState.isSubmitting || isSubmitting ? (
                  <LoadingSpinner />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>

          {/* Sign in here */}
          <div className="justify-center mt-6 text-sm text-center">
            <p>
              {" "}
              Back to{" "}
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
