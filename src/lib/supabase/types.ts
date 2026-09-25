// Row aliases over the generated schema (database.types.ts is overwritten by
// `npm run db:types`, so hand-written names live here).
import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type LedgerEntry = Database["public"]["Tables"]["credit_ledger"]["Row"];
