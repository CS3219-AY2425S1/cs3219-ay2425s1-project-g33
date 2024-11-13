"use client"

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const methods = useForm();

  const onSubmit = () => {
    router.push('/auth/signin');
  };

  return (
    <Card className="p-2 mt-3">
      <CardHeader>
        <BadgeCheck className="text-chart-difficulty-easy"/>
        <CardTitle className="text-xl pt-2">All done!</CardTitle>
        <CardDescription className="text-card-foreground-100">
            Your password has now been reset. Please proceed to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Button
              type="submit"
              className="w-full py-2 mt-2 rounded-md bg-primary"
            >
              Sign in
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
