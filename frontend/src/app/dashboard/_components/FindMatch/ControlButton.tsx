"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useFindMatchContext } from "@/contexts/FindMatchContext";
import { XIcon } from "lucide-react";

export default function ControlButton() {
  const { findingMatch, handleCancelMatch, setShowConfigurationPanel, timer } =
    useFindMatchContext();

  return findingMatch ? (
    <div className="flex flex-row w-full gap-4">
      <Button className="w-full" disabled>
        <span className="flex flex-row items-center gap-2">
          <p>Finding Match: {timer}s</p>
          <LoadingSpinner />
        </span>
      </Button>
      <Button onClick={handleCancelMatch}>
        <XIcon />
      </Button>
    </div>
  ) : (
    <Button className="w-full" onClick={() => setShowConfigurationPanel(true)}>
      Practice Now
    </Button>
  );
}
