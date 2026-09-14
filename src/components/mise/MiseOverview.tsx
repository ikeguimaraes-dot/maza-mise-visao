import { Building2, Clock3 } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { LabelsTable } from "./LabelsTable";
import { PrinterRanking } from "./PrinterRanking";
import { ChecklistsTable } from "./ChecklistsTable";
import type { UpcomingLabel, PrintedThisMonth } from "@/lib/mise/labels";
import type { PrinterRankingRow } from "@/lib/mise/ranking";
import type { ChecklistRow } from "@/lib/mise/checklists";
import type { Unit } from "@/lib/mise/units";
import type { ReactNode } from "react";

export type MiseOverviewProps = {
  units: Unit[]; selected: string; expiringSoon: number; expiredActive: number; printedMonth: PrintedThisMonth; printersActive: number;
  upcoming: { rows: UpcomingLabel[]; total: number }; ranking: PrinterRankingRow[]; checklists: ChecklistRow[]; referenceTime: string; selector: ReactNode;
};
export function MiseOverview({ units, selected, expiringSoon, expiredActive, printedMonth, printersActive, upcoming, ranking, checklists, referenceTime, selector }: MiseOverviewProps) {
  return <div className="mise-overview">
    <header className="maza-page-heading maza-enter"><div><p className="maza-eyebrow">MISE · Visão geral</p><h1>Sua operação, <em>no ponto.</em></h1><p>Validades, rastreabilidade e rotinas. Cada detalhe no seu devido lugar.</p></div></header>
    <div className="mise-context"><span><Building2 size={15} />{selected === "consolidado" ? "Visão consolidada" : units.find((unit) => unit.id === selected)?.name ?? "Unidade selecionada"}</span>{selector}<span><Clock3 size={13} />Leitura às {new Date(referenceTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}</span></div>
    <section className="mise-kpi-grid" aria-label="Indicadores da operação">
      <KpiCard label="A vencer em 24 horas" value={expiringSoon} kind="soon" />
      <KpiCard label="Vencidas não consumidas" value={expiredActive} danger kind="expired" />
      <KpiCard label="Etiquetas no mês" value={printedMonth.currentCount} kind="labels" hint={printedMonth.currentCount > 0 ? `${printedMonth.delta >= 0 ? "+" : ""}${printedMonth.delta.toLocaleString("pt-BR")} em relação ao mês anterior` : undefined} />
      <KpiCard label="Impressoras ativas" value={printersActive} emptyAsDash={false} kind="printers" />
    </section>
    <LabelsTable rows={upcoming.rows} total={upcoming.total} referenceTime={referenceTime} />
    <div className="mise-bottom-grid"><PrinterRanking rows={ranking} /><ChecklistsTable rows={checklists} units={units} /></div>
  </div>;
}
