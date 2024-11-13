import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
