"use server";

import { getAccessToken } from "@/lib/auth";
import {
  UpdateUserProfileSchema,
  UserProfile,
  UserProfileResponse,
  UserProfileResponseSchema,
} from "@/types/User";
import { revalidateTag } from "next/cache";
import { cache } from "react";

export const getCurrentUser = cache(
  async function (): Promise<UserProfileResponse> {
    console.log("getCurrentUser service Invoked");
    const access_token = await getAccessToken();

    try {
      const res = await fetch(
        process.env.PUBLIC_API_URL + `/api/users/current`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          next: { tags: ["currentUser"] },
        }
      );

      const data = await res.json();

      return UserProfileResponseSchema.parse(data);
    } catch (error) {
      return {
        statusCode: 500,
        message: String(error),
      };
    }
  }
);

export async function editUserProfile(
  userProfile: UserProfile
): Promise<UserProfileResponse> {
  const access_token = await getAccessToken();
  try {
    const updatedUserProfile = UpdateUserProfileSchema.parse(userProfile);

    const res = await fetch(process.env.PUBLIC_API_URL + `/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedUserProfile),
    });

    const data = await res.json();

    revalidateTag("currentUser");

    return UserProfileResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}
