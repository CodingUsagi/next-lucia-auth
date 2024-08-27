"uss client";

import { verifyEmail } from "@/actions/auth-actions";
import { useFormState } from "react-dom";
import jwt from "jsonwebtoken";

export function EmailVerificationForm({ token }: { token: string }) {
  const [formState, formAction] = useFormState(verifyEmail.bind(null, token), {
    message: "",
  });

  return (
    <form
      action={formAction}
      className="max-w-md w-1/2 mx-auto mt-8 p-6 bg-white text-gray-800 shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Please enter the verification code
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-gray-700"
          >
            Code
          </label>
          <input
            type="verificationCode"
            id="verificationCode"
            name="verificationCode"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {formState?.message && (
          <p className="text-red-500 text-small">{formState?.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
