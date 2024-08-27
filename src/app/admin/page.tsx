import { verifyAuth } from "@/lib/lucia-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminPage() {
  const result = await verifyAuth();

  if (!result.user) redirect("/");

  return <h1 className="h-screen">page</h1>;
}
