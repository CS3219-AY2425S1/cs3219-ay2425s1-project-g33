import GitGraph from "./GitGraph";
import { QuestionsStatsCard } from "@/app/dashboard/_components/QuestionsStatsCard";
import { SkillsCard } from "./SkillsCard";
import QuestionHistory from "./QuestionHistory/QuestionHistory";

export default function MainContent() {
    return (
        <div className="flex flex-col gap-4">
            <GitGraph />
            <h2 className="font-bold pb-2 pt-2">Collaborations</h2>
            <div className="flex flex-row gap-4">
                <QuestionHistory/>
                <div className="flex flex-col gap-4">
                    <QuestionsStatsCard />
                    <SkillsCard />
                </div>
            </div>


        </div>
    )
}