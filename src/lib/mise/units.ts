import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

// Únicas duas units operacionais do MISE hoje — mesmas do financeiro.
export const YOSHIMORI_UNIT_ID = "674eac8c-5a38-4a42-aa60-0a666387909c";
export const IKY_UNIT_ID = "674eac8c-5a38-4a42-aa60-0a666387909b";
export const KNOWN_UNIT_IDS = [YOSHIMORI_UNIT_ID, IKY_UNIT_ID] as const;

export type Unit = { id: string; name: string };

export async function getUnits(): Promise<Unit[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("units")
    .select("id, name")
    .eq("active", true)
    .in("id", KNOWN_UNIT_IDS)
    .order("name");
  if (error) {
    console.error("[mise] falha ao ler public.units:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Resolve o filtro de unit_id a partir do ?unidade= da URL.
 * "consolidado" (ou qualquer valor desconhecido/ausente) => as duas units.
 */
export function resolveUnitFilter(unidadeParam: string | undefined): {
  unitIds: string[];
  selected: string;
} {
  if (unidadeParam && (KNOWN_UNIT_IDS as readonly string[]).includes(unidadeParam)) {
    return { unitIds: [unidadeParam], selected: unidadeParam };
  }
  return { unitIds: [...KNOWN_UNIT_IDS], selected: "consolidado" };
}
