import PasswordResetConfirmation from "./_components/PasswordResetConfirmation";

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm mx-auto">
        <PasswordResetConfirmation />
      </div>
    </div>
  );
}
