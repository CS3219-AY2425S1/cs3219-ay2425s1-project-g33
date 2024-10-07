"use client";

import { PropsWithChildren, useCallback, useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/form/TextInput";
import MultiBadgeSelectInput from "@/components/form/MultiBadgeSelect";
import { Button } from "@/components/ui/button";
import { TextAreaInput } from "@/components/form/TextAreaInput";
import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import { createQuestion } from "@/services/questionService";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { QuestionTableContext } from "@/contexts/QuestionTableContext";

const FormSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  categories: z.array(z.string()),
  description: z.string(),
});

export function CreateQuestionModal({ children }: PropsWithChildren) {
  const { toast } = useToast();
  const { categories } = useContext(QuestionTableContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      difficulty: "Easy",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      await createQuestion(data);
      setIsOpen(false);
      toast({
        title: "Question added!",
        description: "The question has been added to the repository.",
      });
    },
    [toast]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-primary">Create question</DialogTitle>

          <DialogDescription>
            Add a new question to the Peerprep question repository.
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col pt-6 space-y-4"
            >
              <div className="flex gap-5">
                <TextInput label="Title" name="title" placeholder="Title" />
                <RadioGroupInput
                  label={"Difficulty"}
                  name="difficulty"
                  options={[
                    {
                      value: "Easy",
                      optionLabel: "Easy",
                      className: "text-difficulty-easy",
                    },
                    {
                      value: "Medium",
                      optionLabel: "Medium",
                      className: "text-difficulty-medium",
                    },
                    {
                      value: "Hard",
                      optionLabel: "Hard",
                      className: "text-difficulty-hard",
                    },
                  ]}
                />
              </div>
              <MultiBadgeSelectInput
                name="categories"
                label="Topics"
                options={categories.map((category) => ({
                  value: category,
                  label: category,
                }))}
              />
              <TextAreaInput
                label="Problem Description"
                name="description"
                placeholder="Type your description here"
              />
              <Button className="self-center" type="submit">
                {form.formState.isSubmitting
                  ? "Adding question..."
                  : form.formState.isSubmitted
                  ? "Question added!"
                  : "Add question"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
