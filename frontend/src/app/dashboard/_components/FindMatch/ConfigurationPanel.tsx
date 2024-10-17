"use client";

import { useFindMatchContext } from "@/contexts/FindMatchContext";

import { useMeasure } from "@uidotdev/usehooks";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Difficulty } from "@/types/Question";
import { Category } from "@/types/Category";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MatchConfigurationPanelProps {
  difficulties: Difficulty[];
  topics: Category[];
}

export default function ConfigurationPanel({
  difficulties: difficultyOptions,
  topics: topicOptions,
}: MatchConfigurationPanelProps) {
  const [difficultyRef, { height: difficultyHeight }] = useMeasure();
  const [topicsRef, { height: topicsSelectionHeight }] = useMeasure();

  const {
    showConfigurationPanel,
    setShowConfigurationPanel,
    difficulties,
    setDifficulty,
    topics,
    setTopics,
    handleFindMatch,
  } = useFindMatchContext();

  const handleDifficultyCheckboxChange = (text: Difficulty) => {
    if (difficulties.includes(text)) {
      setDifficulty(difficulties.filter((item) => item !== text));
    } else {
      setDifficulty([...difficulties, text]);
    }
  };

  const handleTopicCheckboxChange = (text: Category) => {
    if (topics.includes(text)) {
      setTopics(topics.filter((item) => item !== text));
    } else {
      setTopics([...topics, text]);
    }
  };

  const [collapseDifficulties, setCollapseDifficulties] = useState(true);

  const [collapseTopics, setCollapseTopics] = useState(false);

  return (
    <Sheet
      open={showConfigurationPanel}
      onOpenChange={setShowConfigurationPanel}
    >
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="flex flex-col h-screen">
        <SheetHeader className="flex">
          <SheetTitle>Start Finding a Peer</SheetTitle>
          <SheetDescription>
            Jumpstart your technical interview prep by connecting with a
            practice partner. Specify your matching criteria below and click
            ‘Find Match’ to get started.
          </SheetDescription>
        </SheetHeader>
        <div className="h-full bg-background" />
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => setCollapseDifficulties(!collapseDifficulties)}
          >
            Select difficulties
          </Button>
          <div
            ref={difficultyRef}
            className={cn(
              "grid grid-cols-2 gap-4 z-0 opacity-100 transition-all duration-500",
              collapseDifficulties && `-z-10 opacity-0`
            )}
            style={{
              marginTop: `${
                collapseDifficulties ? -(difficultyHeight! + 16) : 0
              }px`,
            }}
          >
            <div className="flex items-center col-span-2 space-x-2">
              <Checkbox
                id="All"
                checked={difficulties.length === difficultyOptions.length}
                onCheckedChange={() =>
                  difficulties.length !== difficultyOptions.length
                    ? setDifficulty([...difficultyOptions])
                    : setDifficulty([])
                }
              />
              <label
                htmlFor="All"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select All
              </label>
            </div>
            {difficultyOptions.map((difficulty, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={difficulty}
                  checked={difficulties.includes(difficulty)}
                  onCheckedChange={() =>
                    handleDifficultyCheckboxChange(difficulty)
                  }
                />
                <label
                  htmlFor={difficulty}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {difficulty}
                </label>
              </div>
            ))}
          </div>
          <Button onClick={() => setCollapseTopics(!collapseTopics)}>
            Select topics
          </Button>
          <div
            ref={topicsRef}
            className={cn(
              "grid grid-cols-2 gap-4 z-0 opacity-100 transition-all duration-500",
              collapseTopics && `-z-10 opacity-0`
            )}
            style={{
              marginTop: `${
                collapseTopics ? -(topicsSelectionHeight! + 16) : 0
              }px`,
            }}
          >
            <div className="flex items-center col-span-2 space-x-2">
              <Checkbox
                id="All"
                checked={topics.length === topicOptions.length}
                onCheckedChange={() =>
                  topics.length !== topicOptions.length
                    ? setTopics([...topicOptions])
                    : setTopics([])
                }
              />
              <label
                htmlFor="All"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select All
              </label>
            </div>
            {topicOptions.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={topic}
                  checked={topics.includes(topic)}
                  onCheckedChange={() => handleTopicCheckboxChange(topic)}
                />
                <label
                  htmlFor={topic}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {topic}
                </label>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleFindMatch}>Find Match</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}