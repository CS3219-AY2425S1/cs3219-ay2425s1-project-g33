"use server";

import {
  NewQuestion,
  NewQuestionSchema,
  Questions,
  QuestionsArraySchema,
} from "@/types/Question";
import {
  CreateQuestionFormSchema,
} from "@/validations/form";
import { revalidatePath } from "next/cache";

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

    const questions = resObj?.data?.questions || [];

    return QuestionsArraySchema.parse(questions);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createQuestion(
  data: CreateQuestionFormSchema
): Promise<void> {
  try {
    const question: NewQuestion = NewQuestionSchema.parse(data);

    await fetch(process.env.PUBLIC_API_URL + "/questions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    revalidatePath("/dashboard");
    console.log("Question created successfully");
  } catch (error) {
    console.error("Error creating question: ", error);
  }
}
