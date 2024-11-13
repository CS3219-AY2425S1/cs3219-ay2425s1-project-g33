"use client";

import StepperComponent from "./_components/StepperComponent";
import UserDetailsForm from "./_components/Forms/UserDetailsForm";
import { useOnboardMultiStepFormContext } from "@/contexts/OnboardMultiStepFormContext";
import ProficiencyForm from "./_components/Forms/ProficiencyForm";
import LanguagesForm from "./_components/Forms/LanguagesForm";

export default function OnboardPage() {
  const { currStep } = useOnboardMultiStepFormContext();

  return (
    <div className="max-w-md mx-auto">
      <StepperComponent />
      {currStep === 1 ? (
        <UserDetailsForm />
      ) : currStep === 2 ? (
        <ProficiencyForm />
      ) : (
        <LanguagesForm />
      )}
    </div>
  );
}
