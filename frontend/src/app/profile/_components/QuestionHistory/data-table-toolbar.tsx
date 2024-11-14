"use client";

import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useContext } from "react";
import { HistoryTableContext } from "@/contexts/HistoryTableContext";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories?: string[];
}

export default function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { categories } = useContext(HistoryTableContext);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4">
          {table.getColumn("topicPreference") && (
            <DataTableFacetedFilter
              column={table.getColumn("topicPreference")}
              title="Topics"
              options={
                categories?.map((category) => ({
                  label: category,
                  value: category,
                })) ?? []
              }
            />
          )}
          {table.getColumn("difficultyPreference") && (
            <DataTableFacetedFilter
              column={table.getColumn("difficultyPreference")}
              title="Difficulty"
              options={[
                { label: "Easy", value: "Easy" },
                { label: "Medium", value: "Medium" },
                { label: "Hard", value: "Hard" },
              ]}
            />
          )}
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <LucideSearch className="relative transform -translate-y-1/2 left-7 top-3 text-background-200" />
            <Input
              value={
                (table.getColumn("questionTitle")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("questionTitle")?.setFilterValue(event.target.value)
              }
              placeholder="Search"
              className="max-w-sm pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
