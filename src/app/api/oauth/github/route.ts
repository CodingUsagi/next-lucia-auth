import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { github } from "@/lib/github-auth";
import { OAuth2RequestError } from "arctic";
import { prisma } from "@/db/db";
import { createAuthSession } from "@/lib/lucia-auth";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { accessToken } = await github.validateAuthorizationCode(code);

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const githubUser = await response.json();

    const exisitingUser = await prisma.user.findFirst({
      where: { email: githubUser.email },
    });

    let session = null;

    if (!exisitingUser) {
      try {
        const newUser = await prisma.user.create({
          data: {
            email: githubUser.email,
            name: githubUser.name ? githubUser.name : githubUser.login,
          },
        });
        const newAuthAccount = await prisma.oauthAccount.create({
          data: {
            id: githubUser.id.toString(),
            userId: newUser.id,
            provider: "github",
            providerUserId: githubUser.id.toString(),
            accessToken: accessToken,
          },
        });

        await createAuthSession(newUser.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const updatedOauthAccount = await prisma.oauthAccount.update({
          where: { id: githubUser.id.toString() },
          data: {
            accessToken,
          },
        });

        await createAuthSession(exisitingUser.id);
      } catch (error) {
        console.log(error);
      }
    }

    const loginUrl = new URL("/admin", process.env.NEXT_PUBLIC_BASE_URL!);

    return NextResponse.redirect(loginUrl, { status: 302 });
  } catch (error) {
    // the specific error message depends on the provider
    if (error instanceof OAuth2RequestError) {
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
