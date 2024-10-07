import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import ViewProfileButton from "./ViewProfileButton";

interface ProfileMiniDetailsProps {
  isViewProfileEnabled?: boolean;
}

function ProfileMiniDetails({
  isViewProfileEnabled = false,
}: ProfileMiniDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <UserAvatar
          src={"https://non-existent.com"}
          name={"Jm San Diego"}
          isHoverEnabled={false}
          className="w-16 h-16"
        />
        <div>
          <h4 className="leading-none">Jm San Diego</h4>
          <small className="inline-block mb-1 text-card-foreground-100">@skibidi_toilet</small>
          <p>
            Proficiency:{" "}
            <span className="text-card-foreground-100">Expert</span>
          </p>
          <p>
            Elo:{" "}
            <span className="text-primary">
              1000 <Zap className="inline" size={14} />
            </span>
          </p>
        </div>
      </div>
      {isViewProfileEnabled && (
        <ViewProfileButton />
      )}
    </div>
  );
}

// Normal card variant
export function ProfileMiniDetailsCard() {
  return (
    <Card className="p-5">
      <div>
        <ProfileMiniDetails />
      </div>
    </Card>
  );
}

interface ProfileMiniDetailsHoverCardProps {
  children: React.ReactNode;
}

// Hover card variant
export function ProfileMiniDetailsHoverCard({
  children,
}: ProfileMiniDetailsHoverCardProps) {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="link">{children}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfileMiniDetails isViewProfileEnabled={true} />
      </HoverCardContent>
    </HoverCard>
  );
}
