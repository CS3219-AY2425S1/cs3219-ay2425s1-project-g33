"use client";

import { TextInput } from "@/components/form/TextInput";
import { UserAvatarInput } from "@/components/form/UserAvatarInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback } from "react";
import { useOnboardMultiStepFormContext } from "@/contexts/OnboardMultiStepFormContext";
import { editUserProfile } from "@/services/userService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  profilePicture: z.string(), // TODO: change to actual image file type
  displayName: z.string().trim().min(1, "Display name is required"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(/^[a-z0-9._]*$/, "Only a-z character, _ and . are allowed."),
});

export default function UserDetailsForm() {
  const { userProfile, updateUserProfile, nextStep } =
    useOnboardMultiStepFormContext();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profilePicture: "",
      displayName: userProfile.displayName || "",
      username: userProfile.username || "",
    },
  });

  const handleUsernameOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      form.setValue("username", e.target.value.toLowerCase());
    },
    [form]
  );

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const updatedUserProfile = {
        ...userProfile,
        ...data,
      };

      const userProfileResponse = await editUserProfile(updatedUserProfile);

      if (userProfileResponse.statusCode !== 200) {
        toast({ title: "Error!", description: userProfileResponse.message });
        return;
      }

      updateUserProfile(userProfileResponse.data);
      nextStep();
    },
    [updateUserProfile, userProfile, nextStep, toast]
  );

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle className="text-xl">{`Let's setup your profile`}</CardTitle>
        <CardDescription>
          Tell us more about yourself so that we can provide you a personalised
          experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <UserAvatarInput label="Profile Image" name="profilePicture" />
            <TextInput
              label="Username"
              name="username"
              placeholder={"Username"}
              onChange={(e) => handleUsernameOnChange(e)}
              className="bg-input-background-100"
            />
            <TextInput
              label="Display Name"
              name="displayName"
              placeholder={"Name"}
              className="bg-input-background-100"
            />
            <Button className="self-end w-full max-w-40" type="submit">
              {form.formState.isSubmitting ? <LoadingSpinner /> : "Next"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
