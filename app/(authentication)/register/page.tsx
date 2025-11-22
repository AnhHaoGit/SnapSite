"use client";

import { useState } from "react";
import { Google } from "@lobehub/icons";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { FormEvent } from "react";
import Link from "next/link";

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const router = useRouter();

  // VALIDATE FORM TYPE
  const validateForm = (
    username: string,
    email: string,
    password: string
  ): { valid: boolean; message?: string } => {
    const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate username
    if (!usernameRegex.test(username)) {
      return {
        valid: false,
        message:
          "Username must be 3-20 characters long and contain only letters, numbers, dots, or underscores",
      };
    }

    // Validate email
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Invalid email address" };
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        message:
          "Password must be at least 8 characters, with uppercase, lowercase, number, and special character",
      };
    }

    return { valid: true };
  };

  // CREDENTIAL SIGNUP
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { valid, message } = validateForm(username, email, password);
    if (!valid) {
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Signup successful!");
        router.push("/workspace/home");
      } else {
        toast.error("Signup failed");
      }
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignup = async (): Promise<void> => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/workspace/home" });
  };

  return (
    <main className="p-10 w-full flex flex-col items-center justify-center bg-white h-screen">
      <div className="flex flex-col gap-10">
        <p className="font-bold text-3xl text-black">
          Create a SnapSite account
        </p>

        <button
          className="flex relative bg-white rounded-md border-form-button text-black items-center justify-center py-2 gap-2 text-xs"
          onClick={handleGoogleSignup}
          disabled={loadingGoogle}
        >
          <Google.Color size={20} className="absolute left-2" />
          <p>{loadingGoogle ? "Signing up..." : "Continue with Google"}</p>
        </button>

        <div className="h-px w-full seperated-line"></div>

        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSignup}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-items-start w-full items-center">
                <span className="form-text text-xs font-semibold">
                  Username
                </span>
              </div>

              <input
                type="text"
                placeholder="Enter your username"
                className="border-form-input text-md px-2 py-2 outline-none w-full text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
