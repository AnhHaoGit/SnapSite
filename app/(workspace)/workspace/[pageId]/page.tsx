"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Workspace() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
  }, [status, router, session]);

  return (
    <main className="p-10 flex flex-col items-center justify-center">
      <p className="font-bold text-4xl">New Page</p>
    </main>
  );
}
