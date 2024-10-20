"use client";

import { Suspense } from "react";
import ResetPassword from "./_components/ResetPasswordForm";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-sm mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  );
}
