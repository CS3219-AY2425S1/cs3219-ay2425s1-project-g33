import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import { Card } from "@/components/ui/card";
import StreakCalendar from "./StreakCalendar";

export default function SideContents() {
  return (
    <aside className="flex flex-col col-span-4 xl:col-span-3 2xl:col-span-2  gap-4">
      <ProfileMiniDetailsCard />
      <StreakCalendar />
      <Card>Difficulty Stats</Card>
      <Card>Find Match</Card>
    </aside>
  );
}
