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
      <p className="slate text-rec">{isSignup ? "New crew member" : "Call time"}</p>
      <h1 className="display mt-4 text-5xl">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm text-white-60">
        {isSignup ? "10 free trial credits on signup." : "Log in to keep generating."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        {isSignup && (
          <input
            type="text"
            required
            placeholder="Full name"
            aria-label="Full name"
            className="border border-white-10 bg-ink px-4 py-3.5 text-[15px] text-paper placeholder:text-white-40 focus:border-rec focus:outline-none"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          aria-label="Email"
          className="border border-white-10 bg-ink px-4 py-3.5 text-[15px] text-paper placeholder:text-white-40 focus:border-rec focus:outline-none"
        />
        <input
          type="password"
          required
          placeholder="Password"
          aria-label="Password"
          className="border border-white-10 bg-ink px-4 py-3.5 text-[15px] text-paper placeholder:text-white-40 focus:border-rec focus:outline-none"
        />

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full">
          {isSignup ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className="slate mt-6 flex items-center gap-3 text-white-40">
        <div className="h-px flex-1 bg-white-8" />
        or
        <div className="h-px flex-1 bg-white-8" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="mt-6 w-full"
        onClick={() => router.push("/create")}
      >
        Continue with Google
      </Button>

      <p className="mt-8 text-sm text-white-60">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-paper underline decoration-rec underline-offset-4">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-paper underline decoration-rec underline-offset-4">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
