"use client";

import { logout } from "@/actions/auth-actions";
import { useTransition } from "react";
import { useFormStatus } from "react-dom";

export function LogOutForm() {
  const [isPending, startTransition] = useTransition();

  function signout() {
    startTransition(() => logout());
  }

  return (
    <form action={signout}>
      <button className="text-sm">
        {isPending ? "Logging out" : "Log out"}
      </button>
    </form>
  );
}
