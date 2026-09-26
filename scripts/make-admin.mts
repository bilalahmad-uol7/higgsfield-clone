// Promote an existing account to admin:  npm run make-admin -- you@example.com
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!email) throw new Error("Usage: npm run make-admin -- <email>");
if (!url || !key) throw new Error("Supabase env vars missing — check .env.local");

const db = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await db.from("profiles").update({ role: "admin" }).ilike("email", email).select("email");
if (error) throw error;
if (!data?.length) throw new Error(`No account with email ${email}. Sign up first, then rerun.`);
console.log(`✓ ${data[0].email} is now an admin`);
