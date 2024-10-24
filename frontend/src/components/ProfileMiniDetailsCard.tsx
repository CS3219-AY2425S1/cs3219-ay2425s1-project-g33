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
import { UserProfile } from "@/types/User";

interface ProfileCardProps {
  userProfile: UserProfile;
}

interface ProfileMiniDetailsProps extends ProfileCardProps {
  isViewProfileEnabled?: boolean;
}

function ProfileMiniDetails({
  userProfile,
  isViewProfileEnabled = false,
}: ProfileMiniDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <UserAvatar
          userProfile={userProfile}
          isHoverEnabled={false}
          className="w-16 h-16"
        />
        <div>
          <h4 className="leading-none">{userProfile.displayName}</h4>
          <small className="inline-block mb-1 text-card-foreground-100">
            @{userProfile.username}
          </small>
          <p>
            Proficiency:{" "}
            <span className="text-card-foreground-100">
              {userProfile.proficiency}
            </span>
          </p>
          <p>
            Elo:{" "}
            <span className="text-primary">
              {1000} <Zap className="inline" size={14} />
            </span>
          </p>
        </div>
      </div>
      {isViewProfileEnabled && <ViewProfileButton />}
    </div>
  );
}

type ProfileMiniDetailsCardProp = Omit<
  ProfileMiniDetailsProps,
  "isViewProfileEnabled"
>;

// Normal card variant
export function ProfileMiniDetailsCard({
  userProfile,
}: ProfileMiniDetailsCardProp) {
  return (
    <Card className="p-5">
      <div>
        <ProfileMiniDetails
          userProfile={userProfile}
          isViewProfileEnabled={false}
        />
      </div>
    </Card>
  );
}

interface ProfileMiniDetailsHoverCardProps extends ProfileMiniDetailsProps {
  children: React.ReactNode;
}

// Hover card variant
export function ProfileMiniDetailsHoverCard({
  userProfile,
  isViewProfileEnabled = true,
  children,
}: ProfileMiniDetailsHoverCardProps) {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="link">{children}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfileMiniDetails
          userProfile={userProfile}
          isViewProfileEnabled={isViewProfileEnabled}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
