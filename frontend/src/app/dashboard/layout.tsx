// "use client";

import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";
import React from "react";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <UserProvider>
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </UserProvider>
    </>
  );
}
