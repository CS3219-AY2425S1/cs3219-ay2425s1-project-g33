"use client";

import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useOnboardMultiStepFormContext } from "@/contexts/OnboardMultiStepFormContext";
import { editUserProfile } from "@/services/userService";
import { ProficiencyEnum } from "@/types/Proficiency";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  proficiency: ProficiencyEnum,
});

export default function ProficiencyForm() {
  const { userProfile, updateUserProfile, nextStep, prevStep } =
    useOnboardMultiStepFormContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      proficiency: userProfile.proficiency,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const updatedUserProfile = {
        ...userProfile,
        ...data,
      };

      const userProfileResponse = await editUserProfile(updatedUserProfile);

      if (userProfileResponse.statusCode !== 200) {
        console.error(userProfileResponse.message);
        return;
      }

      updateUserProfile(userProfileResponse.data);
      nextStep();
    },
    [updateUserProfile, userProfile, nextStep]
  );

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle className="text-xl">Select your proficiency level</CardTitle>
        <CardDescription>
          We will match someone of your proficiency level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* <RadioGroupCardInput defaultValue="test1"/> */}
            <RadioGroupInput
              label={""}
              
              name="proficiency"
              options={[
                {
                  value: ProficiencyEnum.Enum.Beginner,
                  optionLabel: ProficiencyEnum.Enum.Beginner,
                  // className: "text-difficulty-easy",
                },
                {
                  value: ProficiencyEnum.Enum.Intermediate,
                  optionLabel: ProficiencyEnum.Enum.Intermediate,
                  // className: "text-difficulty-medium",
                },
                {
                  value: ProficiencyEnum.Enum.Advanced,
                  optionLabel: ProficiencyEnum.Enum.Advanced,
                  // className: "text-difficulty-hard",
                },
              ]}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                className="self-start"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                <MoveLeft className="stroke-foreground-100 mr-2" />
                Back
              </Button>
              <Button className="self-end w-full max-w-40" type="submit">
                {form.formState.isSubmitting ? <LoadingSpinner /> : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
