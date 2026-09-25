import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="hf-heading text-6xl font-medium text-rec">404</p>
      <h1 className="hf-heading mt-4 text-2xl font-medium">Page not found</h1>
      <p className="mt-2 text-sm text-white-60">
        This page doesn&apos;t exist, or it moved somewhere else.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/" variant="primary">
          Back to home
        </Button>
        <Button href="/explore" variant="outline">
          Explore
        </Button>
      </div>
    </div>
  );
}
