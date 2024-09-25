"use client";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/form/TextInput";
import MultiBadgeSelectInput from "@/components/form/MultiBadgeSelect";
import { Button } from "@/components/ui/button";
import { TextAreaInput } from "@/components/form/TextAreaInput";
import { RadioGroupInput } from "@/components/form/RadioGroupInput";
import React from "react";
import { createQuestion } from "@/services/questionService";
import { CreateQuestionFormSchema, createQuestionFormSchema } from "@/validations/form";

interface CreateQuestionModalProps {
  children: React.ReactNode;
}

export function CreateQuestionModal({ children }: CreateQuestionModalProps) {
  const form = useForm<z.infer<typeof createQuestionFormSchema>>({
    resolver: zodResolver(createQuestionFormSchema),
    defaultValues: {
      title: "",
      difficulty: "Medium",
      categories: [],
      description: "",
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);

  async function onSubmit(data: CreateQuestionFormSchema) {
    await createQuestion(data);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Create question</DialogTitle>
          <DialogDescription>
            Add a new question to the Peerprep question repository.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 pt-6"
            >
              <div className="flex gap-5">
                <TextInput label="Title" name="title" placeholder="Title" />
                <RadioGroupInput
                  label={"Difficulty"}
                  name={"difficulty"}
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
                options={[
                  { value: "Two Sum", label: "Two Sum" },
                  { value: "Sliding Window", label: "Sliding Window" },
                  { value: "Dynamic Programming", label: "Dynamic Programming" },
                  { value: "String", label: "String" },
                  { value: "Trees", label: "Trees" },
                ]}
              />
              <TextAreaInput
                label="Problem Description"
                name="description"
                placeholder="Type your description here"
              />
              <Button className="self-center" type="submit">
                Add question
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
