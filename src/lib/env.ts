// Reads a required env var, failing loudly (at request time, not build time)
// so a missing key points straight at .env.example instead of a cryptic
// "fetch failed" deep inside an SDK.
export function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var ${name}. See .env.example.`);
  return value;
}

// NEXT_PUBLIC_* must be referenced literally so Next can inline them into
// the client bundle; that's why each is read by name here.
export const publicEnv = {
  siteUrl: () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supabaseUrl: () => requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseKey: () =>
    requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
};

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
