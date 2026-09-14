export default function Loading() {
  return <div role="status" aria-label="Carregando dados da operação" className="mise-overview"><span className="sr-only">Carregando dados da operação…</span><div className="maza-skeleton" style={{ height: 80, maxWidth: 500 }} /><div className="mise-kpi-grid">{[1, 2, 3, 4].map((id) => <div key={id} className="maza-skeleton" style={{ height: 180 }} />)}</div><div className="maza-skeleton" style={{ height: 360 }} /></div>;
}
