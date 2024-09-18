import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return <div className="container grid grid-cols-12 gap-4 mx-auto py-8">
    <section className="col-span-9 flex flex-col gap-4">
        <h1 className="text-xl">Welcome Back, Diego!</h1>
        <Card>Question Section</Card>
    </section>
    <aside className="col-span-3 flex flex-col gap-4">
        <Card>Profile Overview</Card>
        <Card>Calendar Streak</Card>
        <Card>Difficulty Stats</Card>
        <Card>Find Match</Card>
    </aside>
  </div>;
}

