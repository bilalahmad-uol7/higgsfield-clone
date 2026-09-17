"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AuthForm({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const isSignup = mode === "signup";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/create");
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="hf-heading text-center text-2xl font-medium">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-center text-sm text-white-60">
        {isSignup ? "10 free trial credits on signup." : "Log in to keep generating."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        {isSignup && (
          <input
            type="text"
            required
            placeholder="Full name"
            className="rounded-xl border border-white-8 bg-surface-tertiary px-4 py-3 text-sm text-white-90 placeholder:text-white-40 focus:border-white-24 focus:outline-none"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          className="rounded-xl border border-white-8 bg-surface-tertiary px-4 py-3 text-sm text-white-90 placeholder:text-white-40 focus:border-white-24 focus:outline-none"
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="rounded-xl border border-white-8 bg-surface-tertiary px-4 py-3 text-sm text-white-90 placeholder:text-white-40 focus:border-white-24 focus:outline-none"
        />

        <Button type="submit" variant="lime" className="mt-2 w-full">
          {isSignup ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs text-white-40">
        <div className="h-px flex-1 bg-white-8" />
        or
        <div className="h-px flex-1 bg-white-8" />
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => router.push("/create")}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-white-60">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-white-90 underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white-90 underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
