"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface RadioGroupInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  options: {
    value: string;
    optionLabel: string;
    className?: string;
  }[];
}

export function RadioGroupInput<TFieldValues extends FieldValues>({
  label,
  name,
  options,
}: RadioGroupInputProps<TFieldValues>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              defaultValue={field.value}
              onValueChange={field.onChange}
              className="flex h-9"
            >
              {options.map((option, i) => (
                <FormItem key={i} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={option.value} id={`r${i}`} />
                  </FormControl>
                  <FormLabel htmlFor="r1" className={cn(option.className)}>
                    {option.optionLabel}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// TODO: Custom RadioGroupItem
export const RadioGroupCardInput = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex flex-col gap-5", className)}
      {...props}
      ref={ref}
    >
      <RadioGroupCardItem icon={<User />} label={"test1"} value={"test1"} />
      <RadioGroupCardItem icon={<User />} label={"test2"} value={"test2"} />
    </RadioGroupPrimitive.Root>
  );
});

const RadioGroupCardItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    icon: React.ReactNode;
    label: string;
    description?: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ icon, label, description, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item ref={ref} {...props}>
      <Card
        className={cn(
          "flex flex-row bg-background-200 peer-data-[]:[state=checked]:bg-primary"
        )}
      >
        {icon}
        <div>
          <h4>{label}</h4>
          <p>{description}</p>
        </div>
      </Card>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupCardInput.displayName = "RadioGroupCardInput";

RadioGroupCardItem.displayName = "RadioGroupCardItem";
