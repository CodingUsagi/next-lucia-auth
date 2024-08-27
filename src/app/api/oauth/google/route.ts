import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { google } from "@/lib/google-auth";
import { OAuth2RequestError } from "arctic";
import { prisma } from "@/db/db";
import { createAuthSession } from "@/lib/lucia-auth";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { accessToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();

    const exisitingUser = await prisma.user.findFirst({
      where: { email: googleUser.email },
    });

    let session = null;

    if (!exisitingUser) {
      try {
        const newUser = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
          },
        });
        const newAuthAccount = await prisma.oauthAccount.create({
          data: {
            id: googleUser.sub,
            userId: newUser.id,
            provider: "google",
            providerUserId: googleUser.sub,
            accessToken: accessToken,
            expiresAt: accessTokenExpiresAt,
          },
        });

        await createAuthSession(newUser.id);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const updatedOauthAccount = await prisma.oauthAccount.update({
          where: { id: googleUser.sub },
          data: {
            accessToken,
            expiresAt: accessTokenExpiresAt,
            refreshToken,
          },
        });

        await createAuthSession(exisitingUser.id);
      } catch (e) {
        console.log(e);
      }
    }

    const loginUrl = new URL("/", process.env.NEXT_PUBLIC_BASE_URL!);

    return NextResponse.redirect(loginUrl, { status: 302 });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
