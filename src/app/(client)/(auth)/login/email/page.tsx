import { EmailAuthForm } from "@/components/EmailAuthForm";
import { verifyAuth } from "@/lib/lucia-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const result = await verifyAuth();
  let isLoggedIn = false;
  if (result.user) {
    isLoggedIn = true;
    redirect("/admin");
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <EmailAuthForm mode="login" />
    </main>
  );
}
