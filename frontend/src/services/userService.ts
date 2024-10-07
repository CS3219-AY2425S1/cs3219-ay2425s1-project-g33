"use server";

import { getAccessToken } from "@/lib/auth";
import {
  UpdateUserProfileSchema,
  UserProfile,
  UserProfileResponse,
  UserProfileResponseSchema,
} from "@/types/User";

export async function getCurrentUser(): Promise<UserProfileResponse> {
  try {
    const access_token = await getAccessToken();

    const res = await fetch(process.env.PUBLIC_API_URL + `/api/users/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await res.json();

    return UserProfileResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function editUserProfile(
  userProfile: UserProfile
): Promise<UserProfileResponse> {
  try {
    const access_token = await getAccessToken();

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

    return UserProfileResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}
