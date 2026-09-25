import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { getSessionProfile } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/redirect";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);
  const error = typeof params.error === "string" ? params.error : undefined;

  // Already signed in: skip straight to where they were headed.
  if (await getSessionProfile()) redirect(next);

  return <AuthScreen mode="login" next={next} callbackError={error} />;
}
