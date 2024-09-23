"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAdvancedSearchParams from "@/hooks/useAdvancedSearchParams";

export default function FilterBar() {
  const params = useAdvancedSearchParams();

  const topic = params.get("topic");
  const difficulty = params.get("difficulty");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4">
          <Select
            value={topic || undefined}
            onValueChange={(value) => {
              params.set("topic", value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="hashtable">Hash Table</SelectItem>
              <SelectItem value="linkedlist">Linked List</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={difficulty || undefined}
            onValueChange={(value) => {
              params.set("difficulty", value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4">
          <Input placeholder="Search" />
        </div>
      </div>
      {/*
      TODO: Show all the search params
      <div className="flex flex-row gap-4">
        <p>{params.getAll()}</p>
      </div> */}
    </div>
  );
}
