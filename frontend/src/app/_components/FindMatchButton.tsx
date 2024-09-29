import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function FindMatchButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Practice Now</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Start Finding a Peer</SheetTitle>
          <SheetDescription>
            Jumpstart your technical interview prep by connecting with a
            practice partner. Specify your matching criteria below and click
            ‘Find Match’ to get started.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
