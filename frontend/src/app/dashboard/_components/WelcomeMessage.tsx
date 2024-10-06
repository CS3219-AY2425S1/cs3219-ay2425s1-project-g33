"use client";

import { useUser } from "@/contexts/UserContext";

export default function WelcomeMessage() {
  const user = useUser();

  return <h1 className="text-xl font-bold">Welcome Back, {user?.email}!</h1>;
}
