"use client";

import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { QuestionTableContext } from "@/contexts/QuestionTableContext";
import { useContext } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories?: string[];
}

export default function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { categories } = useContext(QuestionTableContext);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4">
          {table.getColumn("topics") && (
            <DataTableFacetedFilter
              column={table.getColumn("topics")}
              title="Topics"
              options={
                categories?.map((category) => ({
                  label: category,
                  value: category,
                })) ?? []
              }
            />
          )}
          {table.getColumn("difficulty") && (
            <DataTableFacetedFilter
              column={table.getColumn("difficulty")}
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
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
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
