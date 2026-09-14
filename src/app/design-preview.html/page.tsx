import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { WorkspaceTopbar } from "@/components/ui/WorkspaceTopbar";
import { MiseOverview } from "@/components/mise/MiseOverview";
import type { RemoteNavGroup } from "@/lib/nav/types";

const GROUPS: RemoteNavGroup[] = [{ id: "mise", label: "Operação", icon: "ChefHat", defaultOpen: true, habilitado: true, items: [{ label: "MISE · Visão geral", href: "/mise", icon: "ChefHat" }] }];
export default async function Preview({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { empty } = await searchParams;
  const time = new Date();
  const future = (hours: number) => new Date(time.getTime() + hours * 3600000).toISOString();
  const units = [{ id: "demo", name: "Restaurante · demonstração" }];
  return <div className="maza-workspace"><Sidebar navGroups={GROUPS} shellUrl="" navOffline={false} navVersao="preview-v1" /><div className="maza-workspace-body"><WorkspaceTopbar section="MISE" homeHref="/mise" links={[{ href: "/mise", label: "Visão geral", group: "MISE" }]} /><main id="conteudo" tabIndex={-1} className="shell-main maza-page-main"><div style={{ marginBottom: 24 }}><span className="maza-badge" data-tone="warning">Demonstração · dados fictícios</span></div><MiseOverview
    units={units} selected="demo" referenceTime={time.toISOString()} selector={null}
    expiringSoon={empty ? 0 : 12} expiredActive={empty ? 0 : 3} printedMonth={{ currentCount: empty ? 0 : 1842, previousCount: 1610, delta: 232 }} printersActive={empty ? 0 : 4}
    upcoming={{ total: empty ? 0 : 47, rows: empty ? [] : [
      { id: "1", nome: "Salmão porcionado", lote: "SL-0914", setor: "Cozinha fria", metodo_conservacao: "Refrigerado", responsavel_nome: "Ana", validade: future(-2) },
      { id: "2", nome: "Molho de tomate", lote: "MT-0913", setor: "Cozinha quente", metodo_conservacao: "Refrigerado", responsavel_nome: "Bruno", validade: future(4) },
      { id: "3", nome: "Legumes preparados", lote: "LP-0914", setor: "Pré-preparo", metodo_conservacao: "Refrigerado", responsavel_nome: "Carla", validade: future(7) },
      { id: "4", nome: "Caldo de legumes", lote: "CL-0912", setor: "Cozinha quente", metodo_conservacao: "Congelado", responsavel_nome: "Ana", validade: future(48) },
      { id: "5", nome: "Massa fresca", lote: "MF-0914", setor: "Pré-preparo", metodo_conservacao: "Refrigerado", responsavel_nome: "Bruno", validade: future(32) },
    ] }}
    ranking={empty ? [] : [{ nome: "Ana", quantidade: 684, ultimaImpressao: time.toISOString() }, { nome: "Bruno", quantidade: 592, ultimaImpressao: time.toISOString() }, { nome: "Carla", quantidade: 566, ultimaImpressao: time.toISOString() }]}
    checklists={empty ? [] : [{ id: "1", templateNome: "Abertura da cozinha", unitId: "demo", status: "concluido", iniciadoEm: time.toISOString(), concluidoEm: time.toISOString(), hasOpenActionPlan: false }, { id: "2", templateNome: "Conferência das câmaras frias", unitId: "demo", status: "em_andamento", iniciadoEm: time.toISOString(), concluidoEm: null, hasOpenActionPlan: true }]}
  /></main></div></div>;
}
