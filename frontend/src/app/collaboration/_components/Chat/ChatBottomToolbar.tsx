"use client";

import { TextAreaInput } from "@/components/form/TextAreaInput";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useSessionContext } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChatBottomToolbarProps {
  isCollapsed: boolean;
}

const FormSchema = z.object({
  message: z.string().trim(),
});

export default function ChatBottomToolbar({
  isCollapsed,
}: ChatBottomToolbarProps) {
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { handleSendMessage } = useSessionContext();

  const { handleSubmit, formState, reset } = methods;

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (formState.isSubmitting || data.message.length === 0) return;
      handleSendMessage(data.message);
      reset({ message: "" });
    },
    [formState.isSubmitting, handleSendMessage, reset]
  );

  return (
    <CardFooter
      className={cn(
        "pt-3 transition-all duration-300",
        "flex mt-auto h-fit whitespace-normal",
        isCollapsed && "opacity-0"
      )}
    >
      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start w-full space-x-2"
        >
          <TextAreaInput
            label={""}
            name="message"
            placeholder="Type your message..."
            className="bg-input-background-100 !mt-0 h-1 max-h-40"
          />
          <Button type="submit" size="icon" className="bg-primary">
            <Send size={15} />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </Form>
    </CardFooter>
  );
}
