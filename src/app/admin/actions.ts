"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { ok: boolean; message: string } | null;

const UUID = /^[0-9a-f-]{36}$/i;
const MAX_ADJUST = 1_000_000;

// Every admin action re-checks the caller server-side; hiding the buttons in
// the UI is not the security boundary.
export async function adjustCredits(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const amount = Number(formData.get("amount"));
  if (!UUID.test(userId) || !Number.isInteger(amount) || amount === 0 || Math.abs(amount) > MAX_ADJUST) {
    return { ok: false, message: "Enter a whole, non-zero number." };
  }

  const db = createAdminClient();
  const { data: target } = await db.from("profiles").select("credits").eq("id", userId).single();
  if (!target) return { ok: false, message: "User not found." };

  // Never take a balance below zero; log the delta actually applied.
  const applied = Math.max(amount, -target.credits);
  if (applied === 0) return { ok: false, message: "Balance is already 0." };

  const { data, error } = await db.rpc("grant_credits", {
    p_user: userId,
    p_amount: applied,
    p_reason: "admin",
    p_ref: `admin:${admin.id}:${crypto.randomUUID()}`,
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/users");
  return { ok: true, message: `${applied > 0 ? "+" : ""}${applied} → balance ${data}` };
}

export async function toggleAdmin(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!UUID.test(userId)) return { ok: false, message: "Invalid user." };
  if (userId === admin.id) return { ok: false, message: "You can't change your own role." };

  const db = createAdminClient();
  const { data: target } = await db.from("profiles").select("role").eq("id", userId).single();
  if (!target) return { ok: false, message: "User not found." };

  const role = target.role === "admin" ? "user" : "admin";
  const { error } = await db.from("profiles").update({ role }).eq("id", userId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/users");
  return { ok: true, message: role === "admin" ? "Promoted to admin." : "Admin access removed." };
}
