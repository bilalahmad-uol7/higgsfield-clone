export function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(new Date(iso));
}

export function formatCredits(delta: number) {
  return `${delta > 0 ? "+" : ""}${delta.toLocaleString()}`;
}

export const KIND_LABEL: Record<string, string> = {
  subscription: "New subscription",
  renewal: "Renewal",
  credit_pack: "Credit pack",
};

export const REASON_LABEL: Record<string, string> = {
  signup: "Signup bonus",
  purchase: "Purchase",
  generation: "Generation",
  refund: "Refund",
  admin: "Admin adjustment",
};

export function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
}
