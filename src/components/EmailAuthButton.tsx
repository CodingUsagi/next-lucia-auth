import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function EmailAuthButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function customRedirect() {
    startTransition(() => {
      router.push("/login/email");
    });
  }
  console.log(isPending);
  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <button
      onClick={customRedirect}
      type="button"
      className="inline-flex items-center justify-center text-white w-2/3 border border-blue-300 hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-blue-600/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="mr-3 -ml-1 w-5 h-5 text-black"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
        />
      </svg>
      <p className="text-black">Sign in with Email</p>
    </button>
  );
}
