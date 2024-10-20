"use client";

import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";

import TitleColumn from "./QuestionColumns/TitleColumn";
import StatusColumn from "./QuestionColumns/StatusColumn";
import TopicsColumn from "./QuestionColumns/TopicsColumn";
import DifficultyColumn from "./QuestionColumns/DifficultyColumn";
import ActionsColumn from "./QuestionColumns/ActionsColumn";

export const questionTableColumns: ColumnDef<Question>[] = [
  StatusColumn,
  TitleColumn,
  TopicsColumn,
  DifficultyColumn,
  ActionsColumn,
];
