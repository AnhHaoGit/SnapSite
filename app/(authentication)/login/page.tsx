"use client";

import { useState } from "react";
import { Google } from "@lobehub/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { FormEvent } from "react";
import { Suspense } from "react";
import Link from "next/link";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  if (authError === "OAuthAccountNotLinked") {
    toast.error(authError);
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      toast.success("Login successful!");
      setLoading(false);
      router.push("/workspace");
    } else {
      toast.error("Invalid email or password!");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/workspace" });
  };

  return (
    <main className="p-10 w-full flex flex-col items-center justify-center bg-white h-screen">
      <div className="flex flex-col gap-10">
        <p className="font-bold text-3xl text-black">
          Create a SnapSite account
        </p>

        <button
          className="flex relative bg-white rounded-md border-form-button text-black items-center justify-center py-2 gap-2 text-xs"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
        >
          <Google.Color size={20} className="absolute left-2" />
          <p>{loadingGoogle ? "Logging in..." : "Continue with Google"}</p>
        </button>

        <div className="h-px w-full seperated-line"></div>

        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleLogin}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-items-start w-full items-center">
                <span className="form-text text-xs font-semibold">Email</span>
              </div>

              <input
                type="email"
                placeholder="Enter your email address"
                className="border-form-input text-md px-2 py-2 outline-none w-full text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-items-start w-full items-center">
                <span className="form-text text-xs font-semibold">
                  Password
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-form-input text-md px-2 py-2 outline-none w-full text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="focus:outline-none text-black"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="button-blue rounded-md w-full py-2 mt-10"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
