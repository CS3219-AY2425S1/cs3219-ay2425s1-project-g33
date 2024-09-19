import { ProfileMiniDetailsCard, ProfileMiniDetailsHoverCard } from "@/components/ProfileMiniDetailsCard";
import { Card } from "@/components/ui/card";
import StreakCalendar from "./StreakCalendar";
import UserAvatar from "@/components/UserAvatar";

export default function SideContents() {
  return (
    <aside className="flex flex-col col-span-3 gap-4">
      <ProfileMiniDetailsCard />
      <StreakCalendar />
      <Card>Difficulty Stats</Card>
      <Card>Find Match</Card>
    </aside>
  );
}
