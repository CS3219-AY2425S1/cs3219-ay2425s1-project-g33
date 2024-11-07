"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { PropsWithChildren, useCallback } from "react";

import { updateQuestionTestCases } from "@/services/questionService";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/Question";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { CirclePlus, Trash } from "lucide-react";

interface ManageTestCasesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  question: Question;
}

const FormSchema = z.object({
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
    })
  ),
});

export function ManageTestCasesModal({
  isOpen,
  setIsOpen,
  question,
}: PropsWithChildren<ManageTestCasesModalProps>) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { testCases: question.testCases },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  // Updated remove and add functions
  function removeTestCase(index: number) {
    remove(index);
  }

  function addTestCase() {
    append({ input: "", expectedOutput: "" });
  }

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      console.log(data);
      const updateQuestionTestCasesResponse = await updateQuestionTestCases(
        question._id,
        data.testCases
      );
      if (updateQuestionTestCasesResponse.statusCode === 200) {
        setIsOpen(false);
        toast({
          title: "Question test cases updated",
          description: "Question test cases have been updated successfully",
        });
      } else {
        toast({
          title: "Failed to update question test cases",
          description: updateQuestionTestCasesResponse.message,
        });
      }
    },
    [toast, setIsOpen, question]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-primary">Manage Test Cases</DialogTitle>
          <DialogDescription>
            Manage the test cases for the question
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full pt-6 space-y-4"
            >
              <div className="flex items-center space-x-4">
                <h1 className="w-full">Input</h1>
                <h1 className="w-full">Expected Output</h1>
                <Button
                  type="button"
                  className="w-auto opacity-0"
                  variant="ghost"
                  size="icon"
                >
                  <Trash />
                </Button>
              </div>
              {fields.length > 0 ? (
                fields.map((_, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Input
                      {...form.register(`testCases.${index}.input`)}
                      placeholder="Input"
                      className="p-2 border rounded w-full"
                    />

                    <Input
                      {...form.register(`testCases.${index}.expectedOutput`)}
                      placeholder="Expected Output"
                      className="p-2 border rounded w-full"
                    />

                    <Button
                      type="button"
                      className="text-red-500 p-2"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))
              ) : (
                <p>There are no test case(s) set for this quesetion.</p>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={addTestCase}
              >
                <CirclePlus />
              </Button>
              <Button className="self-center" type="submit">
                {form.formState.isSubmitting
                  ? "Updating Test Cases"
                  : form.formState.isSubmitSuccessful
                  ? "Test Cases Updated"
                  : "Update Test Cases"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
