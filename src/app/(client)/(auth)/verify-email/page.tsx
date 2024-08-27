"use client";

import { EmailVerificationForm } from "@/components/EmailVerificationForm";

export default function EmailVerificationPage({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  if (!token) {
    return <div className="text-red-500">Token Not Found</div>;
  }

  return <EmailVerificationForm token={token} />;
}
