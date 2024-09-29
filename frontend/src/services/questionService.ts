"use server";

import { CategoriesResponse, CategoriesResponseSchema } from "@/types/Category";
import {
  Question,
  NewQuestion,
  QuestionResponse,
  QuestionsResponse,
  QuestionResponseSchema,
  QuestionsResponseSchema,
  NewQuestionSchema,
} from "@/types/Question";
import { revalidatePath } from "next/cache";

import qs from "querystring";
import { cache } from "react";

export async function getQuestion(slug: string): Promise<QuestionResponse> {
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions/${slug}`,
      {
        signal: AbortSignal.timeout(5000),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return QuestionResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function getQuestions(): Promise<QuestionsResponse> {
  const query = qs.stringify({
    limit: 99,
  });

  try {
    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions?${query}`,
      {
        cache: "no-cache",
        signal: AbortSignal.timeout(5000),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resObj = await res.json();

    return QuestionsResponseSchema.parse(resObj);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(
        "An error occurred with the backend. Perhaps it is down."
      ),
    };
  }
}

export const getQuestionCategories = cache(
  async function (): Promise<CategoriesResponse> {
    try {
      const res: Response = await fetch(
        process.env.PUBLIC_API_URL + `/api/questions/categories`,
        {
          cache: "no-cache",
          signal: AbortSignal.timeout(5000),
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resObj = await res.json();

      return CategoriesResponseSchema.parse(resObj);
    } catch (error) {
      return {
        statusCode: 500,
        message: String(error),
      };
    }
  }
);

export async function createQuestion(
  question: NewQuestion
): Promise<QuestionResponse> {
  try {
    const res = await fetch(
      process.env.PUBLIC_API_URL + "/api/questions/create",
      {
        method: "POST",
        signal: AbortSignal.timeout(5000),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      }
    );

    const data = await res.json();

    revalidatePath("/dashboard");

    return QuestionResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function deleteQuestion(questionId: string): Promise<void> {
  try {
    await fetch(process.env.PUBLIC_API_URL + `/api/questions/${questionId}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(5000),
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {}
}

export async function editQuestion(
  question: Question
): Promise<QuestionResponse> {
  try {
    const updatedQuestion = NewQuestionSchema.parse(question);
    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions/${question._id}`,
      {
        method: "PATCH",
        signal: AbortSignal.timeout(5000),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuestion),
      }
    );

    const data = await res.json();

    revalidatePath("/dashboard");

    return QuestionResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}
