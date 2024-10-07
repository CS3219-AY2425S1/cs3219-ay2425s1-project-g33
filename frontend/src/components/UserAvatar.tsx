import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileMiniDetailsHoverCard } from "./ProfileMiniDetailsCard";
import { twMerge } from "tailwind-merge";

interface UserAvatarProps {
  src: string;
  name: string;
  isHoverEnabled?: boolean;
  className?: string;
}

export default function UserAvatar({
  src,
  name,
  isHoverEnabled = true,
  className,
}: UserAvatarProps) {
  return isHoverEnabled ? (
    <ProfileMiniDetailsHoverCard>
      <AvatarWrapper src={src} name={name} className={className} />
    </ProfileMiniDetailsHoverCard>
  ) : (
    <AvatarWrapper src={src} name={name} className={className}/>
  );
}

interface AvatarWrapperProps extends Omit<UserAvatarProps, "isHoverEnabled"> {}

function AvatarWrapper({ src, name, className }: AvatarWrapperProps) {
  
  function getInitialsFromName(name: string) { // defined here for encapsulation
    const chunks = name.split(",");

    if (chunks.length > 1) {
      const initials: string[] = [];
      chunks.forEach((chunk) => initials.push(chunk[0]));
      return initials.join("");
    } else {
      const [fname, lname] = chunks[0].split(" ");
      return `${fname[0]}${lname ? lname[0] : ""}`;
    }
  }

  return (
    <Avatar className={twMerge("w-9 h-9 rounded-full", className)}>
      <AvatarImage src={src} alt="@shadcn" />
      <AvatarFallback className="text-base font-normal text-foreground ">
        {getInitialsFromName(name)}
      </AvatarFallback>
    </Avatar>
  );
}
