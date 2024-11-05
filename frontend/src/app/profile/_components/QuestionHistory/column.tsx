"use client";

import { ColumnDef } from "@tanstack/react-table";
import TitleColumn from "./QuestionColumns/TitleColumn";
import TopicsColumn from "./QuestionColumns/TopicsColumn";
import DifficultyColumn from "./QuestionColumns/DifficultyColumn";
import DurationColumn from "./QuestionColumns/DurationColumn";
import CollaboratorsColumn from "./QuestionColumns/CollaboratorsColumn";
import EloColumn from "./QuestionColumns/EloColumn";
import { HistoryItem } from "@/types/History";
import DateColumn from "./QuestionColumns/DateColumn";

export const questionTableColumns: ColumnDef<HistoryItem>[] = [
  TitleColumn,
  DateColumn,
  TopicsColumn,
  DifficultyColumn,
  DurationColumn,
  EloColumn,
  CollaboratorsColumn
];
