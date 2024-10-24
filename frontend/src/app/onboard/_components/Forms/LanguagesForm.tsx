"use client";

import MultiBadgeSelectInput from "@/components/form/MultiBadgeSelect";
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
import { useToast } from "@/hooks/use-toast";
import { editUserProfile } from "@/services/userService";
import { LanguageEnum } from "@/types/Languages";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  languages: z.array(LanguageEnum).min(1, "At least 1 language is required"),
  isOnboarded: z.boolean(),
});

export default function LanguagesForm() {
  const router = useRouter();

  const { toast } = useToast();

  const { userProfile, prevStep } = useOnboardMultiStepFormContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      languages: userProfile.languages,
      isOnboarded: true,
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
        toast({ title: "Error!", description: userProfileResponse.message });
        return;
      }

      toast({
        title: "Sucessfully Onboarded!",
        description: "Redirecting to /dashboard",
      });

      router.replace("/dashboard");
    },
    [router, userProfile, toast]
  );

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle className="text-xl">
          Select your preferred programming language(s)
        </CardTitle>
        <CardDescription>
          We will match someone who uses the same language as you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <MultiBadgeSelectInput
              label={""}
              name={"languages"}
              options={[
                {
                  value: LanguageEnum.enum.Python,
                  label: LanguageEnum.enum.Python,
                },
                {
                  value: LanguageEnum.enum.Java,
                  label: LanguageEnum.enum.Java,
                },
                {
                  value: LanguageEnum.enum["C++"],
                  label: LanguageEnum.enum["C++"],
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
                {form.formState.isSubmitting ? <LoadingSpinner /> : "Done"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
