import { verifyAuth } from "@/lib/lucia-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Header } from "../_components/Header";

export default async function AdminPage() {
  const result = await verifyAuth();

  if (!result.user) redirect("/");

  return (
    <div>
      <Header />
      <h1 className="h-screen flex justify-center items-center">
        This is admin page!
      </h1>
    </div>
  );
}
