"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { titleCaseWord } from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";

export function QuestionsStatsCard() {
  return (
    <Card className="flex flex-col items-center gap-1 p-5">
      <DifficultyPieChart />
      <div className="flex items-center gap-2">
        <DifficultySubStatCard type="easy" />
        <DifficultySubStatCard type="medium" />
        <DifficultySubStatCard type="hard" />
      </div>
    </Card>
  );
}

function DifficultySubStatCard({ type }: { type: "easy" | "medium" | "hard" }) {
  return (
    <Card className="text-center shadow-none">
      <CardContent className="px-5 py-2">
        <CardHeader className="p-0">
          <h4
            className={clsx("text-sm ", {
              "text-difficulty-easy": type === "easy",
              "text-difficulty-medium": type === "medium",
              "text-difficulty-hard": type === "hard",
            })}
          >
            {titleCaseWord(type)}
          </h4>
        </CardHeader>
        <CardDescription className="flex flex-col items-center">
          <small>10/22</small>
          {/* <p>(25%)</p> */}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export const description = "A donut chart";

export function DifficultyPieChart() {
  return (
    <div className="relative h-[95px] w-full">
      <ChartContainer
        config={
          {
            easy: {
              label: "Easy",
              color: "var(--chart-difficulty-easy)",
            },
            medium: {
              label: "Medium",
              color: "var(--chart-difficulty-medium)",
            },
            hard: {
              label: "Hard",
              color: "var(--chart-difficulty-hard)",
            },
          } satisfies ChartConfig
        }
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-[190px] mx-auto aspect-square"
      >
        <ResponsiveContainer aspect={0.6}>
          <PieChart
            width={95}
            height={95}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <ChartTooltip
              position={{ x: 150, y: 85 }}
              offset={-35}
              cursor={true}
              content={
                <ChartTooltipContent hideLabel={false} labelKey="Attempted" />
              }
            />
            <Pie
              data={[
                {
                  difficulty: "Easy",
                  attempted: 10,
                  fill: "var(--color-easy)",
                },
                {
                  difficulty: "Medium",
                  attempted: 7,
                  fill: "var(--color-medium)",
                },
                {
                  difficulty: "Hard",
                  attempted: 5,
                  fill: "var(--color-hard)",
                },
              ]}
              dataKey="attempted"
              nameKey="difficulty"
              innerRadius={60}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {`22`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-card-foreground"
                        >
                          attempted
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
