"use server";

import { z } from "zod";
import { createUser, getUserByEmail } from "@/lib/users";
import { redirect } from "next/navigation";
import { createAuthSession, destroySession } from "@/lib/lucia-auth";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/google-auth";
import { github } from "@/lib/github-auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/db/db";

const userSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(4, { message: "Password must have at least 4 characters" }),
});

export async function signup(prevState: any, formData: FormData) {
  const result = userSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      ...prevState,
      zodErrors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to login",
    };
  }

  const data = result.data;

  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    return {
      ...prevState,
      zodErrors: null,
      message: "Email exists. Pleaes choose another.",
    };
  }

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(data.password, salt);

  const user = await createUser(data.email, hashedPassword);

  if (user == null) {
    return {
      ...prevState,
      message: "Couldn't sign up this user.",
    };
  }

  //Create an email verification link and code
  const code = Math.random().toString(36).substring(2, 8);
  try {
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        email: user.email!,
        code,
      },
    });
  } catch (error) {
    console.log(error);
  }

  const token = jwt.sign({ email: user.email, code }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await createAuthSession(user.id);
  redirect("/login");
}

export async function login(prevState: any, formData: FormData) {
  const result = userSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      ...prevState,
      zodErrors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to login",
    };
  }

  const data = result.data;

  const existingUser = await getUserByEmail(data.email);

  if (!existingUser)
    return {
      ...prevState,
      zodErrors: null,
      message: "Couldn'authenticate user, please try again!",
    };

  const { hashedPassword } = existingUser;

  const isValidPassword = await compareSync(data.password, hashedPassword!);

  if (!isValidPassword)
    return {
      ...prevState,
      zodErrors: null,
      message: "Couldn'authenticate user, please try again!",
    };

  await createAuthSession(existingUser.id);
  redirect("/admin");
}

export async function auth(mode: string, prevState: any, formData: FormData) {
  if (mode === "login") {
    return login(prevState, formData);
  }

  return signup(prevState, formData);
}

export async function logout() {
  cookies().delete("google_code_verifier");
  cookies().delete("google_oauth_state");
  cookies().delete("github_oauth_state");
  await destroySession();
  redirect("/login");
}

export async function createGoogleAuthorizationURL() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationURL = await google.createAuthorizationURL(
    state,
    codeVerifier,
    {
      scopes: ["profile", "email"],
    }
  );

  cookies().set("google_oauth_state", state, {
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 2,
  });

  cookies().set("google_code_verifier", codeVerifier, {
    secure: process.env.NODE_ENV == "production",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 2,
  });

  return {
    success: true,
    data: authorizationURL,
  };
}

export async function createGithubAuthorizationURL() {
  try {
    const state = generateState();

    const authorizationURL = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    cookies().set("github_oauth_state", state, {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 2,
    });

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function verifyEmail(
  token: string,
  prevState: any,
  formData: FormData
) {
  let isVerified: boolean = false;

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      email: string;
      code: string;
    };

    const code = formData.get("verificationCode") as string;

    if (code.length !== 6 || !code || code !== decodedToken.code) {
      return { message: "Invalid code!" };
    }

    if (code === decodedToken.code) {
      isVerified = true;
    }

    const user = await getUserByEmail(decodedToken.email);
    const updateRes = await prisma.user.update({
      where: { id: user?.id },
      data: {
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.log(error);
  }

  if (isVerified) return redirect("/");
}
