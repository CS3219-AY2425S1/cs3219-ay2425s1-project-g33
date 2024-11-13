import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

export default function SolutionTabContent() {
  return (
    <div className="flex w-full h-full">
      <div className="my-auto mx-auto flex flex-col items-center gap-4">
        <LockKeyhole className="w-16 h-16 text-primary" />
        <h1 className="text-2xl font-bold text-center">Subscribe to unlock</h1>
        <p className="max-w-96 text-center">
          Thanks for using PeerPrep! To view the solution you must subscribe to
          premium.
        </p>
        <Button className="w-fit">Subscribe</Button>
      </div>
    </div>
  );
}
