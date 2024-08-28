"use client";

import { auth } from "@/actions/auth-actions";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { ZodErrors } from "./ZodErrors";
import { Loading } from "./Loading";

export function EmailAuthForm({ mode }: { mode: string }) {
  const [formState, formAction] = useFormState(auth.bind(null, mode), {});
  const { pending } = useFormStatus();

  return (
    <div className="w-full md:w-1/3 mx-5">
      {pending ? (
        <Loading />
      ) : (
        <form
          action={formAction}
          className="w-full mx-auto mt-8 p-6 bg-white text-gray-800 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {mode === "login" ? "Login" : "Sign Up"}
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ZodErrors error={formState?.zodErrors?.email} />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
          {formState?.message && (
            <p className="text-sm text-red-500 mt-1">{formState?.message}</p>
          )}

          {mode === "login" && (
            <div className="my-4 w-full flex items-center justify-between text-sm">
              <a href="#!" className="hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          )}
          <div className="flex justify-center mt-2 hover:text-blue-500">
            <p>
              {mode === "login" && (
                <Link href="/signup" className="text-sm">
                  Create an account
                </Link>
              )}
              {mode === "signup" && (
                <Link href="/login/email" className="text-sm">
                  Login with existing account
                </Link>
              )}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
