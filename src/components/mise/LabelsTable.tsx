"use client";

import { useMemo, useState } from "react";
import { Search, Tag } from "lucide-react";
import { classifyValidade, formatRemaining } from "@/lib/mise/dates";
import type { UpcomingLabel } from "@/lib/mise/labels";

const STATES = [{ key: "all", label: "Todas" }, { key: "vencida", label: "Vencidas" }, { key: "proxima", label: "Próximas 24h" }, { key: "normal", label: "No prazo" }];
const LABEL: Record<string, string> = { vencida: "Vencida", proxima: "Atenção", normal: "No prazo" };
function dateLabel(value: string) { return new Date(value).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }); }

export function LabelsTable({ rows, total, referenceTime }: { rows: UpcomingLabel[]; total: number; referenceTime: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const nowMs = new Date(referenceTime).getTime();
  const visible = useMemo(() => {
    const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return rows.filter((row) => (filter === "all" || classifyValidade(row.validade, nowMs) === filter) && normalize([row.nome, row.setor, row.responsavel_nome, row.lote].join(" ")).includes(normalize(query)));
  }, [rows, filter, query, nowMs]);
  return <section className="maza-panel mise-labels">
    <div className="maza-panel-heading"><div><h2>De olho na validade</h2><p>{total.toLocaleString("pt-BR")} etiquetas ativas · prioridade para os próximos vencimentos</p></div><Tag size={19} style={{ color: "var(--text-3)" }} /></div>
    <div className="mise-table-tools"><div className="mise-filter-group" role="group" aria-label="Filtrar por validade">{STATES.map((state) => <button type="button" key={state.key} aria-pressed={filter === state.key} onClick={() => setFilter(state.key)}>{state.label}</button>)}</div><label className="mise-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto, lote ou setor" aria-label="Buscar etiquetas" /></label></div>
    {total > rows.length && <p className="mise-table-note">A busca e os filtros se aplicam às {rows.length} etiquetas carregadas, ordenadas por validade.</p>}
    {visible.length === 0 ? <div className="mise-empty"><Tag size={28} /><p>{rows.length ? "Nenhuma etiqueta corresponde a este filtro." : "As etiquetas aparecerão aqui quando houver registros disponíveis."}</p></div> : <>
      <div className="maza-table-scroll mise-labels-desktop" role="region" aria-label="Etiquetas e prazos" tabIndex={0}><table className="maza-table"><caption className="sr-only">Etiquetas por validade, em horário de Brasília</caption><thead><tr><th>Produto / lote</th><th>Setor / conservação</th><th>Responsável</th><th>Validade</th><th>Situação</th></tr></thead><tbody>{visible.map((row) => {
        const urgency = classifyValidade(row.validade, nowMs);
        return <tr key={row.id}><td><strong>{row.nome}</strong><small>Lote {row.lote ?? "não informado"}</small></td><td>{row.setor ?? "—"}<small>{row.metodo_conservacao ?? "—"}</small></td><td>{row.responsavel_nome ?? "—"}</td><td className="mise-nowrap">{dateLabel(row.validade)}</td><td><span className="maza-badge" data-tone={urgency === "vencida" ? "danger" : urgency === "proxima" ? "warning" : "success"}>{LABEL[urgency]}</span><small>{formatRemaining(row.validade, nowMs)}</small></td></tr>;
      })}</tbody></table></div>
      <div className="mise-labels-mobile">{visible.map((row) => {
        const urgency = classifyValidade(row.validade, nowMs);
        return <details key={row.id}><summary><span><strong>{row.nome}</strong><small>{row.setor ?? "Setor não informado"} · {dateLabel(row.validade)}</small></span><span className="maza-badge" data-tone={urgency === "vencida" ? "danger" : urgency === "proxima" ? "warning" : "success"}>{formatRemaining(row.validade, nowMs)}</span></summary><dl><div><dt>Lote</dt><dd>{row.lote ?? "—"}</dd></div><div><dt>Conservação</dt><dd>{row.metodo_conservacao ?? "—"}</dd></div><div><dt>Responsável</dt><dd>{row.responsavel_nome ?? "—"}</dd></div><div><dt>Situação</dt><dd>{LABEL[urgency]}</dd></div></dl></details>;
      })}</div>
    </>}
    <div className="mise-table-footer" aria-live="polite">{visible.length} de {rows.length} etiquetas carregadas · horário de Brasília</div>
  </section>;
}
