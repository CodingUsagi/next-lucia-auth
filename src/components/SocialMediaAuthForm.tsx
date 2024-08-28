"use client";

import { login } from "@/actions/auth-actions";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { GithubAuthButton } from "./GithubAuthButton";
import { EmailAuthButton } from "./EmailAuthButton";
import { useActionState } from "react";

export function SocialMediaAuthForm() {
  const [formState, formAction, isPending] = useActionState(login, {});

  if (isPending) {
    return <p>Logging in...</p>;
  }

  return (
    <form
      action={formAction}
      className="flex justify-center flex-col max-w-md w-5/6 lg:w-1/2 mx-auto mt-8 py-6 bg-white text-gray-800 shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <div className="flex flex-col items-center">
        <GoogleAuthButton />
        <GithubAuthButton />
        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-3/4 h-px my-10 bg-gray-200 border-0" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">
            or
          </span>
        </div>
        <EmailAuthButton />
      </div>
    </form>
  );
}
