"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserProfile, UserProfileSchema } from "@/types/User";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/form/TextInput";
import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import { useToast } from "@/hooks/use-toast";
import { editUserProfile } from "@/services/userService";
import { useRouter } from "next/navigation";
import { ProficiencyEnum } from "@/types/Proficiency";

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userProfile: UserProfile;
}

const FormSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  username: z.string().min(1, "Username is required"),
  proficiency: ProficiencyEnum,
});

export function EditProfile({
  isOpen,
  setIsOpen,
  userProfile,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: userProfile.displayName,
      username: userProfile.username,
      proficiency: userProfile.proficiency,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const newProfielUser = UserProfileSchema.parse({
        ...userProfile,
        ...data,
      });

      const response = await editUserProfile(newProfielUser);

      if (response.statusCode !== 200) {
        toast({
          variant: "destructive",
          title: "Error updating profile",
          description: response.message,
        });
        return;
      } else {
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        });
        setIsOpen(false);
        router.refresh();
      }
    },

    [toast, setIsOpen, router, userProfile]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Profile</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              {/* Display Name */}
              <TextInput
                label="Display Name"
                name="displayName"
                placeholder="Display Name"
              />

              {/* Username */}
              <TextInput
                label="Username"
                name="username"
                placeholder="Username"
              />
              {form.formState.errors.username && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.username.message ||
                    "Username already taken"}
                </p>
              )}

              {/* Proficiency Radio Buttons */}
              <RadioGroupInput
                label="Proficiency"
                name="proficiency"
                options={[
                  { value: "Beginner", optionLabel: "Beginner" },
                  { value: "Intermediate", optionLabel: "Intermediate" },
                  { value: "Advanced", optionLabel: "Advanced" },
                ]}
              />

              <Button className="p-5" type="submit">
                {form.formState.isSubmitting ? "Updating Profile" : "Save"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
