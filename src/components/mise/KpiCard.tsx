import { AlertCircle, Clock3, Printer, Tag } from "lucide-react";

export function KpiCard({ label, value, emptyAsDash = true, danger = false, hint, kind = "labels" }: {
  label: string; value: number; emptyAsDash?: boolean; danger?: boolean; hint?: string; kind?: "soon" | "expired" | "labels" | "printers";
}) {
  const showDash = emptyAsDash && value === 0;
  const Icon = { soon: Clock3, expired: AlertCircle, labels: Tag, printers: Printer }[kind];
  return <article className="maza-panel maza-kpi mise-kpi maza-enter" data-kind={kind}>
    <div className="mise-kpi-heading"><span className="maza-kpi-label">{label}</span><Icon size={19} /></div>
    <div className="maza-kpi-value" style={{ color: danger && value > 0 ? "var(--color-danger)" : undefined }}>{showDash ? "—" : value.toLocaleString("pt-BR")}</div>
    <div className="maza-kpi-sub">{hint && !showDash ? hint : showDash ? "Sem registros disponíveis" : { soon: "Priorize o uso nas próximas horas", expired: "Itens que precisam de conferência", labels: "Rastreabilidade na sua operação", printers: "Pontos de impressão cadastrados" }[kind]}</div>
  </article>;
}
