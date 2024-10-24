"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { PropsWithChildren, useCallback, useContext } from "react";

import MultiBadgeSelectInput from "@/components/form/MultiBadgeSelect";
import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import { TextAreaInput } from "@/components/form/TextAreaInput";
import { TextInput } from "@/components/form/TextInput";
import { editQuestion } from "@/services/questionService";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/Question";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { QuestionTableContext } from "@/contexts/QuestionTableContext";

interface CreateQuestionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  question: Question;
}

const FormSchema = z.object({
  _id: z.string(),
  title: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  categories: z.array(z.string()),
  description: z.string(),
  slug: z.string(),
});

export function EditQuestionModal({
  isOpen,
  setIsOpen,
  question,
}: PropsWithChildren<CreateQuestionModalProps>) {
  const { toast } = useToast();
  const { categories } = useContext(QuestionTableContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      _id: question._id,
      title: question.title,
      difficulty: question.difficulty,
      categories: question.categories,
      description: question.description,
      slug: question.slug,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const question = await editQuestion(data);
      console.log(question.message);
      if (question.statusCode === 200) {
        setIsOpen(false);
        toast({
          title: "Question updated!",
          description: "The question has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error editing the question.",
        });
      }
    },
    [toast, setIsOpen]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit question</DialogTitle>
          <DialogDescription>
            Edit a question in the Peerprep question repository.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col pt-6 space-y-4"
            >
              <div className="flex gap-5">
                <TextInput label="Title" name="title" placeholder="Title" />
                <RadioGroupInput
                  label="Difficulty"
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
                label="Topics"
                name="categories"
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
                  ? "Updating Question"
                  : form.formState.isSubmitSuccessful
                  ? "Question Updated"
                  : "Update Question"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
