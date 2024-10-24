import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";
import React from "react";
import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const currentUser = await getCurrentUser();

  console.log("dashboard");

  if (currentUser.statusCode === 401 || !currentUser.data) {
    console.log("dashboard 401 or data not fetced");
    redirect("/auth/signin");
  }

  if (!currentUser.data?.isOnboarded) {
    console.log("isOnboard false?: " + currentUser.data?.isOnboarded);
    redirect("/onboard");
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
