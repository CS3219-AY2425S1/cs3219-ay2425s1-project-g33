import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import {
  ChangeEvent,
  ComponentType,
  InputHTMLAttributes,
  RefAttributes,
  useCallback,
} from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";

interface TextInputProps<TFieldValues extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: FieldPath<TFieldValues>;
  Icon?: ComponentType<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export function TextInput<TFieldValues extends FieldValues>({
  label,
  name,
  placeholder,
  className,
  onChange,
  type = "text",
  Icon,
  ...props
}: TextInputProps<TFieldValues>) {
  const form = useFormContext();

  const handleOnChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      field: ControllerRenderProps<FieldValues, Path<TFieldValues>>
    ) => {
      if (onChange) {
        onChange(e);
      } else {
        field.onChange(e);
      }
    },
    [onChange]
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {Icon ? (
              <div className="relative">
                <span className="absolute transform -translate-y-1/2 left-2 top-1/2">
                  <Icon size={20} />
                </span>
                <Input
                  className={cn(className, "pl-10")}
                  placeholder={placeholder}
                  type={type}
                  {...field}
                  onChange={(e) => handleOnChange(e, field)}
                  {...props}
                  style={{}}
                />
              </div>
            ) : (
              <Input
                className={cn(className)}
                placeholder={placeholder}
                type={type}
                {...field}
                onChange={(e) => handleOnChange(e, field)}
                {...props}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
