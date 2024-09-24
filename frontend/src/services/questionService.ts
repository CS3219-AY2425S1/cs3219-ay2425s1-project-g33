"use server";

import { Questions, QuestionsArraySchema } from "@/types/Question";

export default async function getQuestions(): Promise<Questions> {
  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + "/questions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resObj = await res.json();

    console.log("Questions: " + resObj?.data?.questions);
    const questions = resObj?.data?.questions || [];

    return QuestionsArraySchema.parse(questions);
  } catch (error) {
    console.error(error);
    return [];
  }
}