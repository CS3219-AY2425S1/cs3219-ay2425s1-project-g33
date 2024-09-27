"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import React from "react";
import { cn } from "@/lib/utils";

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
