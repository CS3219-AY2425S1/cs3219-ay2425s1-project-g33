import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkillsCard() {
    return (
        <Card className="flex flex-row items-center gap-3 p-2">
            <IndividualSkillCard title="Arrays" count="x7" />
            <IndividualSkillCard title="Dynamic Programming" count="x10" />
            <IndividualSkillCard title="Two Pointers" count="x5" />
        </Card>
    )
}

function IndividualSkillCard({ title, count }: { title: string; count: string }) {
    return(
        <Card className="text-center shadow-none bg-background-200">
            <div className="flex flex-row justify-between items-center p-2">
                <h4 className="text-primary text-sm font-semibold pr-2">{title}</h4>
                <span className="text-sm">{count}</span>
            </div>
        </Card>
    )
}