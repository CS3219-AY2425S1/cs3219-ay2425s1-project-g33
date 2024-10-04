import { Card } from "@/components/ui/card";
import CollaborationHeatmap from "./HeatMap";

export default function GitGraph() {
    const monthsData = [
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0], // January
        [0, 1, 1, 0, 0, 1, 0, 1, 0, 0], // February
        [1, 0, 0, 1, 0, 1, 1, 1, 0, 0], // March
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0], // April
        [0, 1, 1, 0, 0, 1, 0, 1, 0, 0], // May
        [1, 0, 0, 1, 0, 1, 1, 1, 0, 0], // June
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0], // July
        [0, 1, 1, 0, 0, 1, 0, 1, 0, 0], // August
        [1, 0, 0, 1, 0, 1, 1, 1, 0, 0], // Sept
        [1, 0, 0, 0, 1, 1, 0, 1, 0, 0], // Oct
        [0, 1, 1, 0, 0, 1, 0, 1, 0, 0], // Nov
        [1, 0, 0, 1, 0, 1, 1, 1, 0, 0], // Dec
      ];

    return (
        <Card className="flex flex-col rounded-md p-6 gap-4">
            <StatsHeader />
            <div className="flex flex-row"> 
                <StatsDetails/>
                <CollaborationHeatmap
                    monthsData={monthsData}
                    year={2024}
                />
            </div>
        </Card>
    )
}

function StatsHeader() {
    return (
        <div className="flex flex-row gap-2">
            <big className="font-bold">15</big>
            <big className="text-card-foreground-100"> collaborations done in the past one year</big>
        </div>
    )
}
function StatsDetails() {
    return (
        <div className="flex flex-col gap-2 pt-2 pl-2 pr-4">
            <div className="flex flex-col p-1">
                <small className="font-bold"> Total Active: </small>
                <small className="text-card-foreground-100"> 15 Days </small>
            </div>
            <div className="flex flex-col p-1">
                <small className="font-bold"> Max Streaks: </small>
                <small className="text-card-foreground-100"> 3 Days </small>
            </div>
        </div>
    )
}

function MonthlyCommits({ month } : { month: string }) {

}