"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function ViewProfileButton() {
  const router = useRouter();
  return (
    <Button
      variant="soft"
      className="w-full"
      onClick={() => {
        router.push("/profile");
      }}
    >
      View Profile
    </Button>
  );
}
