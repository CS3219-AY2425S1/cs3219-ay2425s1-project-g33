"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { User, Lock } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface FormData {
  username: string;
  password: string;
}

export default function DashboardPage() {
  const methods = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { control, formState: { errors } } = methods;

  return (
    <div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
      <section className="col-span-9 flex flex-col gap-4 ">
        <Card className="bg-background-200 p-3">
          <div className="flex flex-col p-8">
            <h1 className="font-bold text-2xl mb-2"> Welcome!</h1>
            <h2 className="mb-6">Log in to start coding!</h2>

            {/* To input log in details */}
            <FormProvider {...methods}>
              <form>
                <div className="flex flex-col gap-y-4">

                  {/* Username Field */}
                  <FormField
                    control={control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username / Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              type="text"
                              placeholder="Username / Email"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {/* Display error message below input */}
                        {errors.username && (
                          <p className="text-difficulty-hard mt-1">{errors.username.message}</p>
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
                          <div className='relative'>
                            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                            <input
                              {...field}
                              type="password"
                              placeholder="Password"
                              className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                            />
                          </div>
                        </FormControl>
                        {/* Display error message below input */}
                        {errors.password && (
                          <p className="text-difficulty-hard mt-1">{errors.password.message}</p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Forgot password link */}
                <div className="text-right pt-2 pb-2">
                  <Link href="/forgotpassword" className="hover:underline text-sm"> Forgot password? </Link>
                </div>

                {/* Sign In Button */}
                <button 
                  type="button"
                  className="w-full bg-primary font-bold rounded-md py-2"
                > 
                  Sign In
                </button>
              </form>
            </FormProvider>

            {/* Or sign in with */}
            <div className="flex items-center my-6"> 
              <hr className="flex-grow muted-foreground border-t" />
              <span className="mx-2 text-sm">Or sign in with</span>
              <hr className="flex-grow border-t"/>
            </div>
            
            {/* Socials */}
            <div className="flex flex-row gap-x-4 justify-center">
              <button className="rounded-md">
                {/*<FaGithub size={24}/> */}
              </button>

              <button className="rounded-md">
                {/* <FaGoogle size={24}/>*/}
              </button>
            </div>

            {/* Sign up here */}
            <div className="text-center justify-center text-sm mt-6"> 
              <p> No account yet? <Link href="/signup" className="hover:underline text-primary">Sign up</Link> </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
