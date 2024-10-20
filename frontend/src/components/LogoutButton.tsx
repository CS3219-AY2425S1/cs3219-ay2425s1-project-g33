"use client";

import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const onClick = useCallback(async () => {
    await logout();
    localStorage.removeItem("access_token");
    router.replace("/auth/signin");
  }, [router]);

  return (
    <Button onClick={onClick} variant="ghost" className="p-2">
      <LogOut size={20} />
    </Button>
  );
}
