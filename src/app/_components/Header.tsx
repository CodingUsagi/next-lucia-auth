import { verifyAuth } from "@/lib/lucia-auth";
import Link from "next/link";
import { LogOutForm } from "./LogOutForm";

export async function Header() {
  const result = await verifyAuth();

  return (
    <header className="flex justify-end items-center mr-10 pt-5">
      <nav>
        <ul>
          {!result?.user ? (
            <div className="flex space-x-10 mx-10">
              <li>
                <Link href="/signup">Sign up</Link>
              </li>

              <li>
                <Link href="/login">Log in</Link>
              </li>
            </div>
          ) : (
            <LogOutForm />
          )}
        </ul>
      </nav>
    </header>
  );
}
