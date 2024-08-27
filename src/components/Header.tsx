import { verifyAuth } from "@/lib/auth";
import { Nav, NavLink } from "./Nav";
import { logout } from "@/app/(client)/actions/auth-actions";

export default async function Header() {
  const result = await verifyAuth();
  let isLoggedIn = false;
  if (result.user) {
    isLoggedIn = true;
  }

  return (
    <div className="flex justify-end items-center mr-10 pt-5">
      <Nav>
        {!isLoggedIn ? (
          <>
            <NavLink href="/signup">Sign up</NavLink>
            <NavLink href="/login">Log in</NavLink>
          </>
        ) : (
          <form action={logout}>
            <button>Log out</button>
          </form>
        )}
      </Nav>
    </div>
  );
}
