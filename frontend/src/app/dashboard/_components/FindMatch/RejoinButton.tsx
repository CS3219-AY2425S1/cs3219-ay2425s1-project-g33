"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface RejoinSessionButtonProps {
  sessionId: string;
}

export default function RejoinSessionButton({
  sessionId,
}: RejoinSessionButtonProps) {
  const router = useRouter();

  const handleOnClick = useCallback(() => {
    router.push(`/collaboration/${sessionId}`);
  }, []);

  return (
    <Button className="w-full" onClick={handleOnClick}>
      Rejoin Session
    </Button>
  );
}
