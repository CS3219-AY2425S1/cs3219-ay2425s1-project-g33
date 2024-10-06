"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Github } from "lucide-react";
import Link from "next/link";
import { User, Lock, Mail } from "lucide-react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { z } from "zod";
import { signup } from "@/services/authService";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const SignupFormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
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

export default function SignUpPage() {
  const router = useRouter();

  const methods = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<z.infer<typeof SignupFormSchema>> = async (
    data
  ) => {
    if (data.password !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }

    const accessTokenResponse = await signup(data);
    if (accessTokenResponse.statusCode === 200 && accessTokenResponse.data) {
      localStorage.setItem(
        "access_token",
        accessTokenResponse.data.access_token
      );
      router.push("/dashboard");
    } else {
      // TODO: Display error message
    }
  };

  return (
    <div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
      <section className="col-span-9 flex flex-col gap-4 ">
        <Card className="bg-background-200 p-2">
          <div className="flex flex-col p-6">
            <h1 className="font-bold text-2xl mb-2">Sign up</h1>
            <h2 className="mb-6 text-sm">
              Join PeerPrep today and start your journey toward acing tech
              interviews!
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-2">
                  {/* Username Field */}
                  <FormField
                    control={control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              placeholder="Username"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {errors.username && (
                          <FormMessage>{errors.username.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              type="email"
                              placeholder="Email"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {errors.email && (
                          <FormMessage>{errors.email.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              type="password"
                              placeholder="Password"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {errors.password && (
                          <FormMessage>{errors.password.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              type="password"
                              placeholder="Confirm Password"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {errors.confirmPassword && (
                          <FormMessage>
                            {errors.confirmPassword.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Forgot password link */}
                <div className="text-right pt-2 pb-2">
                  <Link
                    href="/forgotpassword"
                    className="hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-primary font-bold rounded-md py-2"
                >
                  Sign Up
                </button>
              </form>
            </FormProvider>

            {/* Or sign up with */}
            <div className="flex items-center my-6">
              <hr className="flex-grow muted-foreground border-t" />
              <span className="mx-2 text-sm">Or sign up with</span>
              <hr className="flex-grow border-t" />
            </div>

            {/* Socials */}
            <div className="flex flex-row gap-x-4 justify-center">
              <button className="rounded-md">
                <Github />
              </button>
              <button className="rounded-md">
                {/* Add google button here */}
              </button>
            </div>

            {/* Sign up here */}
            <div className="text-center justify-center text-sm mt-6">
              <p>
                Already have an account? Click here to{" "}
                <Link href="/signin" className="hover:underline text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
