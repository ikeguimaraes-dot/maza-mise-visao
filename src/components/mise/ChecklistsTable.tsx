import { ClipboardCheck } from "lucide-react";
import type { ChecklistRow } from "@/lib/mise/checklists";
import type { Unit } from "@/lib/mise/units";

export function ChecklistsTable({ rows, units }: { rows: ChecklistRow[]; units: Unit[] }) {
  const unitName = (id: string) => units.find((unit) => unit.id === id)?.name ?? "—";
  return <section className="maza-panel mise-checklists"><div className="maza-panel-heading"><div><h2>O cuidado vira rotina</h2><p>Últimos checklists da operação</p></div><ClipboardCheck size={19} style={{ color: "var(--text-3)" }} /></div>
    {rows.length === 0 ? <div className="mise-empty"><ClipboardCheck size={28} /><p>Os checklists aparecerão aqui quando houver execuções disponíveis.</p></div> : <div className="mise-checklist-list">{rows.map((row) => <article key={row.id}>
      <span className="mise-check-icon" aria-hidden="true"><ClipboardCheck size={17} /></span><div><h3>{row.templateNome}</h3><p>{unitName(row.unitId)} · {row.iniciadoEm ? new Date(row.iniciadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }) : "Sem data"}</p><div className="mise-statuses"><span className="maza-badge">{row.status?.replace(/_/g, " ") ?? "Sem status"}</span>{row.hasOpenActionPlan && <span className="maza-badge" data-tone="warning">Plano de ação em aberto</span>}</div></div>
    </article>)}</div>}
  </section>;
}
