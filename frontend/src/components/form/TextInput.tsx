import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
  
  interface TextInputProps<TFieldValues extends FieldValues> {
    label: string,
    name: FieldPath<TFieldValues>;
    placeholder: string;
  }
  
  export function TextInput<TFieldValues extends FieldValues>({ label, name, placeholder }: TextInputProps<TFieldValues>) {
    const form = useFormContext();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />
    );
  }
  