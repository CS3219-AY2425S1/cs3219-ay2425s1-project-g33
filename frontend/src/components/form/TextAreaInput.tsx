import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextAreaInputProps<TFieldValues extends FieldValues>
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: FieldPath<TFieldValues>;
}

export function TextAreaInput<TFieldValues extends FieldValues>({
  label,
  name,
  placeholder,
  className,
  ...props
}: TextAreaInputProps<TFieldValues>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              className={cn("bg-input h-52", className)}
              placeholder={placeholder}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
