import { Sidebar } from "@/components/Sidebar";
import { fetchNavConfig } from "@/lib/nav/fetchNavConfig";

import { WorkspaceTopbar, type QuickLink } from "@/components/ui/WorkspaceTopbar";
import type { RemoteNavItem } from "@/lib/nav/types";

export const dynamic = "force-dynamic";

export default async function MiseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navConfig = await fetchNavConfig();

  const links: QuickLink[] = [];
  function visit(items: RemoteNavItem[], group: string) {
    for (const item of items) {
      if (item.href) links.push({ href: item.href.startsWith("/mise") ? item.href : `${navConfig.shellUrl}${item.href}`, label: item.label, group });
      if (item.children) visit(item.children, group);
    }
  }
  navConfig.groups.filter((group) => group.habilitado !== false).forEach((group) => visit(group.items, group.label ?? "Maza"));
  return (
    <div className="maza-workspace">
      <a className="maza-skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Sidebar
        navGroups={navConfig.groups}
        shellUrl={navConfig.shellUrl}
        navOffline={navConfig.offline}
        navVersao={navConfig.versao}
      />
      <div className="maza-workspace-body">
      <WorkspaceTopbar section="MISE" homeHref="/mise" links={links} />
      <main id="conteudo" tabIndex={-1} className="shell-main maza-page-main">
        {children}
      </main>
      </div>
    </div>
  );
}
