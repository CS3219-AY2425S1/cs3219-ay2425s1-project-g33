import React from "react";
import Navbar from "@/components/Navbar";
import { OnboardMultiStepFormProvider } from "@/contexts/OnboardMultiStepFormContext";
import { UserProfileResponse } from "@/types/User";
import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export default async function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfileResponse: UserProfileResponse = await getCurrentUser();

  if (userProfileResponse.statusCode === 401) {
    redirect("/auth/signin");
  }

  if (userProfileResponse.data?.isOnboarded) {
    redirect("/dashboard");
  }

  if (!userProfileResponse.data) {
    return <div>{userProfileResponse.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMinimal={true} className="relative mt-8 border-b-0" />
      <div className="flex-1 max-h-20" />
      <main className="flex-1">
        {userProfileResponse.data && (
          <OnboardMultiStepFormProvider
            defaultUserProfile={userProfileResponse.data}
          >
            {children}
          </OnboardMultiStepFormProvider>
        )}
      </main>
      <Toaster />
    </div>
  );
}
