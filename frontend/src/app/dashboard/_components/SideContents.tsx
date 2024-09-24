import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import StreakCalendarCard from "./StreakCalendarCard";
import { QuestionsStatsCard } from "./QuestionsStatsCard";
import { FindMatchButton } from "./FindMatchButton";

export default function SideContents() {
  return (
    <aside className="flex flex-col col-span-4 gap-4 xl:col-span-3 2xl:col-span-2">
      <ProfileMiniDetailsCard />
      <StreakCalendarCard />
      <QuestionsStatsCard />
      <FindMatchButton />
    </aside>
  );
}
