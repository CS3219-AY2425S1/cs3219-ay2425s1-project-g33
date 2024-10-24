"use client";

import { ProficiencyEnum } from "@/types/Proficiency";
import { RoleEnum } from "@/types/Role";
import { UserProfile } from "@/types/User";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface OnboardMultiStepFormContextType {
  userProfile: UserProfile;
  totalSteps: number;
  currStep: number;
  setStep: (val: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserProfile: (val: UserProfile) => void;
}

const defaultValues: OnboardMultiStepFormContextType = {
  userProfile: {
    id: "",
    username: "",
    displayName: "",
    email: "",
    roles: [RoleEnum.enum.user],
    proficiency: ProficiencyEnum.enum.Beginner,
    languages: [],
    isOnboarded: false,
  },
  totalSteps: 3,
  currStep: 1,
  setStep: () => {},
  nextStep: () => {},
  prevStep: () => {},
  updateUserProfile: () => {},
};

export const OnboardMultiStepFormContext =
  createContext<OnboardMultiStepFormContextType>(defaultValues);

export function useOnboardMultiStepFormContext() {
  return useContext(OnboardMultiStepFormContext);
}

interface OnboardMultiStepFormProviderProps {
  defaultUserProfile: UserProfile;
  defaultCurrStep?: number;
  children: ReactNode;
}

export function OnboardMultiStepFormProvider({
  defaultUserProfile,
  defaultCurrStep,
  children,
}: OnboardMultiStepFormProviderProps) {
  const [currStep, setCurrStep] = useState<number>(
    defaultCurrStep ?? defaultValues.currStep
  );
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);

  const setStep = useCallback((val: number) => {
    setCurrStep(val);
  }, []);

  const nextStep = useCallback(() => {
    setCurrStep((prevCurrStep) =>
      Math.min(prevCurrStep + 1, defaultValues.totalSteps)
    );
  }, []);

  const prevStep = useCallback(() => {
    setCurrStep((prevCurrStep) => Math.max(prevCurrStep - 1, 1));
  }, []);

  const updateUserProfile = useCallback((updatedUser: UserProfile) => {
    setUserProfile((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
  }, []);

  return (
    <OnboardMultiStepFormContext.Provider
      value={{
        userProfile,
        totalSteps: defaultValues.totalSteps,
        currStep,
        setStep,
        nextStep,
        prevStep,
        updateUserProfile,
      }}
    >
      {children}
    </OnboardMultiStepFormContext.Provider>
  );
}
