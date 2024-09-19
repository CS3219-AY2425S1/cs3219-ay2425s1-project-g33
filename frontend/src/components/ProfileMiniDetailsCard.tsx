import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";

export function ProfileMiniDetailsCard() {
  return (
    <Card className="p-5">
      <CardDescription className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <UserAvatar src={"https://non-existent.com"} name={"Jm San Diego"} />
          <div>
            <p>Jm San Diego</p>
            <small>@skibidi_toilet</small>
            <p>Elo: 1000</p>
          </div>
        </div>
      </CardDescription>
    </Card>
  );
}

interface ProfileMiniDetailsHoverCardProps {
  children: React.ReactNode
}

export function ProfileMiniDetailsHoverCard({children}: ProfileMiniDetailsHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">{children}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="w-4 h-4 mr-2 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}