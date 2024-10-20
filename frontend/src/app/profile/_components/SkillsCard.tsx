import { Card } from "@/components/ui/card";

export function SkillsCard() {
  return (
    <div className="flex flex-col">
      <Card className="p-2">
        <h4 className="p-2 font-bold">Skills</h4>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex flex-row items-center gap-2">
            <IndividualSkillCard title="Arrays" count="x7" />
            <IndividualSkillCard title="Two Pointers" count="x5" />
          </div>
          <IndividualSkillCard title="Dynamic Programming" count="x10" />
        </div>
      </Card>
    </div>
  );
}

function IndividualSkillCard({
  title,
  count,
}: {
  title: string;
  count: string;
}) {
  return (
    <Card className="text-center shadow-none rounded-md bg-background-200">
      <div className="flex flex-row justify-between items-center p-2">
        <h4 className="text-primary text-sm font-semibold pr-2">{title}</h4>
        <span className="text-sm">{count}</span>
      </div>
    </Card>
  );
}
