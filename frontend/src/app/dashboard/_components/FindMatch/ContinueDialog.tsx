"use client";

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useFindMatchContext } from "@/contexts/FindMatchContext";
import { useCallback, useEffect } from "react";

import { useCountdown } from "usehooks-ts";

export default function ContinueDialog() {
  const {
    handleFindMatch,
    handleCancelMatch,
    showContinueDialog,
    setShowContinueDialog,
  } = useFindMatchContext();

  const [counter, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 10,
      intervalMs: 1000,
      isIncrement: false,
    });

  const handleCancel = useCallback(() => {
    handleCancelMatch();
    setShowContinueDialog(false);
    stopCountdown();
  }, [handleCancelMatch, setShowContinueDialog, stopCountdown]);

  const handleContinue = useCallback(() => {
    handleFindMatch();
    setShowContinueDialog(false);
  }, [handleFindMatch, setShowContinueDialog]);

  // onComplete logic here
  useEffect(() => {
    if (counter === 0) {
      handleCancel();
    }
  }, [counter, handleCancel]);

  useEffect(() => {
    if (showContinueDialog) {
      startCountdown();
    } else {
      stopCountdown();
      resetCountdown();
    }
  }, [showContinueDialog, startCountdown, stopCountdown, resetCountdown]);

  return (
    <AlertDialog open={showContinueDialog}>
      <AlertDialogContent className="flex flex-col gap-12">
        <AlertDialogHeader>
          <AlertDialogTitle>
            You have been waiting for quite awhile ({counter}s)
          </AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to continue waiting for a match?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
