import React from "react";
import Navbar from "@/components/Navbar";
import { OnboardMultiStepFormProvider } from "@/contexts/OnboardMultiStepFormContext";
import { UserProfileResponse } from "@/types/User";
import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";

export default async function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfileResponse: UserProfileResponse = await getCurrentUser();

  if (
    userProfileResponse.statusCode === 401
  ) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMinimal={true} className="relative mt-8 border-b-0" />
      <div className="flex-1 max-h-20" />
      <main className="flex-1">
        <OnboardMultiStepFormProvider defaultUserProfile={userProfileResponse.data}>{children}</OnboardMultiStepFormProvider>
      </main>
    </div>
  );
}
