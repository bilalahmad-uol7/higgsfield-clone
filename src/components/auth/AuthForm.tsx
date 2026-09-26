"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signInWithGoogle, signUp, type AuthState } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";

// Google's standard multicolor "G" mark, as used on sign-in buttons.
function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

const FIELD =
  "border border-white-10 bg-ink px-4 py-3.5 text-[15px] text-paper placeholder:text-white-40 focus:border-rec focus:outline-none";

const CALLBACK_ERRORS: Record<string, string> = {
  oauth: "Google sign-in didn't complete. Try again, or use email.",
  confirm: "That confirmation link is invalid or expired. Sign up again to get a new one.",
};

export function AuthForm({
  mode,
  next,
  callbackError,
}: {
  mode: "login" | "signup";
  next: string;
  callbackError?: string;
}) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(isSignup ? signUp : signIn, null);
  const [googleState, googleAction, googlePending] = useActionState<AuthState, FormData>(signInWithGoogle, null);

  const error = state?.error ?? googleState?.error ?? (callbackError ? CALLBACK_ERRORS[callbackError] : undefined);
  const nextQuery = next === "/create" ? "" : `?next=${encodeURIComponent(next)}`;

  if (state?.message) {
    return (
      <div className="mx-auto w-full max-w-sm">
        <p className="slate text-rec">Check your inbox</p>
        <h1 className="display mt-4 text-5xl">Almost on set.</h1>
        <p className="mt-3 text-sm text-white-70" role="status">
          {state.message}
        </p>
        <Link href={`/login${nextQuery}`} className="slate mt-8 inline-block text-paper underline decoration-rec underline-offset-4">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="slate text-rec">{isSignup ? "New crew member" : "Call time"}</p>
      <h1 className="display mt-4 text-5xl">{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-3 text-sm text-white-60">
        {isSignup ? "120 free credits on signup." : "Log in to keep generating."}
      </p>

      {error && (
        <p role="alert" className="mt-6 border border-rec/60 bg-rec/10 px-4 py-3 text-sm text-paper">
          {error}
        </p>
      )}

      <form action={formAction} className="mt-8 flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        {isSignup && (
          <input
            name="full_name"
            type="text"
            required
            autoComplete="name"
            defaultValue={state?.fullName}
            placeholder="Full name"
            aria-label="Full name"
            className={FIELD}
          />
        )}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state?.email}
          placeholder="Email"
          aria-label="Email"
          className={FIELD}
        />
        <input
          name="password"
          type="password"
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder={isSignup ? "Password (8+ characters)" : "Password"}
          aria-label="Password"
          className={FIELD}
        />

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={pending || googlePending}>
          {pending ? "One moment…" : isSignup ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className="slate mt-6 flex items-center gap-3 text-white-40">
        <div className="h-px flex-1 bg-white-8" />
        or
        <div className="h-px flex-1 bg-white-8" />
      </div>

      <form action={googleAction}>
        <input type="hidden" name="next" value={next} />
        <Button type="submit" variant="outline" size="lg" className="mt-6 w-full" disabled={pending || googlePending}>
          <GoogleIcon />
          {googlePending ? "Opening Google…" : "Continue with Google"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-white-60">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href={`/login${nextQuery}`} className="text-paper underline decoration-rec underline-offset-4">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href={`/signup${nextQuery}`} className="text-paper underline decoration-rec underline-offset-4">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
