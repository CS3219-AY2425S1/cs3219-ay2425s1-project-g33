"use server";

import { Questions, QuestionsArraySchema } from "@/types/Question";

export default async function getQuestions(): Promise<Questions> {
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + "/question/questions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return QuestionsArraySchema.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}
