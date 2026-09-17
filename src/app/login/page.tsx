import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-4 py-14 md:px-6">
      <AuthForm mode="login" />
    </div>
  );
}
