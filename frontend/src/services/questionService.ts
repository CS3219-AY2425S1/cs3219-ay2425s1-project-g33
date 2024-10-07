"use server";

import { getAccessToken } from "@/lib/auth";
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
    const access_token = await getAccessToken();

    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
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
    const access_token = await getAccessToken();

    const res: Response = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions?${query}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const resObj = await res.json();

    return QuestionsResponseSchema.parse(resObj);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export const getQuestionCategories = cache(
  async function (): Promise<CategoriesResponse> {
    try {
      const access_token = await getAccessToken();

      const res: Response = await fetch(
        process.env.PUBLIC_API_URL + `/api/questions/categories`,
        {
          cache: "no-cache",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
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
    const access_token = await getAccessToken();

    const res = await fetch(
      process.env.PUBLIC_API_URL + "/api/questions/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
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
    const access_token = await getAccessToken();

    await fetch(process.env.PUBLIC_API_URL + `/api/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {}
}

export async function editQuestion(
  question: Question
): Promise<QuestionResponse> {
  try {
    const access_token = await getAccessToken();

    const updatedQuestion = NewQuestionSchema.parse(question);
    const res = await fetch(
      process.env.PUBLIC_API_URL + `/api/questions/${question._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
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
