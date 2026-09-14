import { Printer } from "lucide-react";
import type { PrinterRankingRow } from "@/lib/mise/ranking";

export function PrinterRanking({ rows }: { rows: PrinterRankingRow[] }) {
  const max = Math.max(1, ...rows.map((row) => row.quantidade));
  return <section className="maza-panel mise-ranking"><div className="maza-panel-heading"><div><h2>Quem faz acontecer</h2><p>Impressões por responsável · mês atual</p></div><Printer size={19} style={{ color: "var(--text-3)" }} /></div>
    {rows.length === 0 ? <div className="mise-empty"><Printer size={28} /><p>As impressões da equipe aparecerão aqui.</p></div> : <ol>{rows.map((row, index) => <li key={row.nome}>
      <div className="mise-rank-heading"><span className="mise-avatar" aria-hidden="true">{row.nome.trim().slice(0, 2).toUpperCase()}</span><span><strong>{row.nome}</strong><small>{row.ultimaImpressao ? `Última: ${new Date(row.ultimaImpressao).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}` : "Sem data de impressão"}</small></span><b>{row.quantidade.toLocaleString("pt-BR")}</b></div>
      <div className="mise-rank-track" aria-hidden="true"><span style={{ width: `${row.quantidade / max * 100}%`, background: index === 0 ? "var(--chart-1)" : index === 1 ? "var(--chart-2)" : "var(--chart-3)" }} /></div>
    </li>)}</ol>}
  </section>;
}
