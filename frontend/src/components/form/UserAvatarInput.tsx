"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";

interface UserAvatarInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
}

export function UserAvatarInput<TFieldValues extends FieldValues>({
  label,
  name,
}: UserAvatarInputProps<TFieldValues>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex gap-5">
              <UserAvatar
                isHoverEnabled={false}
                userProfile={{
                  id: "1",
                  username: "_",
                  email: "_",
                  displayName: "_",
                  proficiency: "Advanced",
                  languages: ["Python"],
                  isOnboarded: true,
                  roles: ["user"],
                }}
                className="w-20 h-20"
              />
              <div className="flex flex-col items-start flex-1">
                <Button
                  variant="soft"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Coming Soon :)");
                  }}
                >
                  Upload Image
                </Button>
                <small>
                  .png, .jpeg files up to 2MB. Recommended size is 256x256px.
                </small>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
