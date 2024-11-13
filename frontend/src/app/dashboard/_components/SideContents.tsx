import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import StreakCalendarCard from "./StreakCalendarCard";
import { QuestionsStatsCard } from "./QuestionsStatsCard";
import FindMatchButton from "./FindMatch/FindMatchButton";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";

export default async function SideContents() {
  const userProfileResponse = await getCurrentUser();

  if (userProfileResponse.statusCode === 401) {
    redirect("/auth/signin");
  }

  if (!userProfileResponse.data) {
    return <div>{userProfileResponse.message}</div>;
  }

  return (
    <div className={cn("relative h-full w-full", "col-span-4 xl:col-span-3")}>
      <aside className="sticky flex flex-col gap-4 h-fit top-[5.5rem]">
        <ProfileMiniDetailsCard userProfile={userProfileResponse.data} />
        <StreakCalendarCard />
        <QuestionsStatsCard />
        <FindMatchButton />
      </aside>
    </div>
  );
}
