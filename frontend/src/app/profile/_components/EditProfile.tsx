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

import { Form, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/form/TextInput";
import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CodeXml } from "lucide-react";
import { updateProfile } from "@/services/profileService";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userProfile: {
    displayName: string;
    username: string;
    email: string;
    proficiency: string;
  };
}

const FormSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
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
      email: userProfile.email,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const response = await updateProfile(data);

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

    [toast, setIsOpen, router]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Profile</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
            {/* Profile Image Upload */}
            {/*<FormLabel className="pt-8">Profile Image</FormLabel>
             <div className="flex flex-row justify-center items-center p-2">
                <input
                    type="file"
                    className="hidden"
                    id="profile-upload"
                    accept="image/*"
                />
                
                <Avatar>
                    <AvatarImage/>
                    <AvatarFallback className="text-base font-normal text-foreground">
                        <CodeXml/>
                    </AvatarFallback>
                </Avatar>

                <div className="pl-6">
                    <label
                        htmlFor="profile-upload"
                        className="bg-background-200 text-sm rounded-lg font-bold p-2 cursor-pointer"
                    >
                        Upload Image
                    </label>
                    <DialogDescription className="pt-2">.png, .jpeg files up to 2MB. Recommended size is 256x256px.</DialogDescription>
                </div>
            </div> */}

            {/* Display Name */}
            <TextInput label="Display Name" name="displayName" placeholder="Display Name" />

            {/* Username */}
            <TextInput label="Username" name="username" placeholder="Username" />
            {form.formState.errors.username && (
            <p className="text-destructive text-sm">
                {form.formState.errors.username.message || "Username already taken"}
            </p>
            )}

            {/* Email */}
            {/* <TextInput label="Email" name="email" placeholder="Email" /> */}

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
            {form.formState.isSubmitting
                ? "Updating Profile"
                : "Save"}
            </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
