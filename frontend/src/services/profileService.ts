"use server";
import { getAccessToken } from "@/lib/auth";
import { Profile, ProfileResponse, ProfileResponseSchema, ProfileSchema, UpdateProfile, UpdateProfileSchema } from "@/types/Profile";

export async function getProfile(): Promise<ProfileResponse> {
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

    return ProfileResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}

export async function updateProfile(profile: UpdateProfile): Promise<ProfileResponse> {
  try {
    const access_token = await getAccessToken();
    const updatedProfileDetails = UpdateProfileSchema.parse(profile);
    const res = await fetch(process.env.PUBLIC_API_URL + `/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedProfileDetails),
    });

    const data = await res.json();

    return ProfileResponseSchema.parse(data);
  } catch (error) {
    return {
      statusCode: 500,
      message: String(error),
    };
  }
}