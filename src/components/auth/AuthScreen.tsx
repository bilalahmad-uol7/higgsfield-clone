import { REEL } from "@/data/home";
import { mediaUrl } from "@/lib/media";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Viewfinder } from "@/components/motion/Viewfinder";
import { AuthForm } from "@/components/auth/AuthForm";

// Split screen: a rolling shot on the left (the "set"), the form on the right.
export function AuthScreen({
  mode,
  next,
  callbackError,
}: {
  mode: "login" | "signup";
  next: string;
  callbackError?: string;
}) {
  const shot = mode === "signup" ? REEL[4] : REEL[1];
  return (
    <div className="grid min-h-[calc(100svh-3.5rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-white-10 bg-ink lg:block">
        <LazyVideo src={mediaUrl(shot.media)} eager className="noir-media" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
        <Viewfinder rec label={shot.meta} inset="inset-8" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="slate text-white-60">Now showing · {shot.title}</p>
          <p className="display mt-4 max-w-md text-5xl">
            {mode === "signup" ? (
              <>
                Every director starts <em>somewhere.</em>
              </>
            ) : (
              <>
                Back on <em>set.</em>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16 md:px-8">
        <AuthForm mode={mode} next={next} callbackError={callbackError} />
      </div>
    </div>
  );
}
