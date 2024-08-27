import { EmailAuthForm } from "@/components/EmailAuthForm";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <EmailAuthForm mode="signup" />
    </main>
  );
}
