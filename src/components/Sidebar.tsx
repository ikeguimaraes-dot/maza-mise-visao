"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { convertRemoteGroups, flattenHrefs, type NavGroup, type RemoteNavGroup } from "@/lib/nav/types";

const ZONES = [
  "financeiro",
  "pessoas",
  "operacao",
  "compras",
  "comercial",
  "marca",
  "inteligencia",
  "mise",
] as const;

function getZone(pathname: string): string {
  if (pathname === "/orquestrador" || pathname.startsWith("/orquestrador/")) {
    return "inteligencia";
  }
  const match = pathname.match(new RegExp(`^/(${ZONES.join("|")})(?:/|$)`));
  return match?.[1] ?? "shell";
}

function getNavigationHref(href: string | undefined, pathname: string, shellUrl: string): string {
  if (!href) return "#";
  if (getZone(href) === getZone(pathname)) return href;
  return shellUrl ? `${shellUrl}${href}` : href;
}

function NavigationLink({
  href,
  pathname,
  shellUrl,
  children,
  style,
}: {
  href?: string;
  pathname: string;
  shellUrl: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const destination = getNavigationHref(href, pathname, shellUrl);
  return (
    <a href={destination} style={style}>
      {children}
    </a>
  );
}

const GROUPS_STORAGE_KEY = "maza_sidebar_groups";
const VERSAO_STORAGE_KEY = "maza_sidebar_versao";

export function Sidebar(props: { navGroups: RemoteNavGroup[]; shellUrl: string; navOffline: boolean; navVersao: string }) {
  const { navGroups: rawNavGroups, shellUrl, navOffline, navVersao } = props;
  // Resolução de ícone (string → componente Lucide) tem que acontecer aqui,
  // no client — o server só pode entregar dado serializável (string), nunca
  // o componente em si, senão o Next quebra a fronteira Server→Client
  // Component ("Functions cannot be passed directly to Client Components").
  const navGroups = useMemo(() => convertRemoteGroups(rawNavGroups), [rawNavGroups]);
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--sidebar-border)" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: -0.5 }}>Maza</div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-3)",
            marginTop: 2,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          MISE
        </div>
      </div>

      {navOffline && (
        <div
          title="Não foi possível carregar o menu do shell — mostrando apenas as rotas desta zona."
          style={{
            margin: "10px 16px 0",
            padding: "6px 10px",
            borderRadius: 8,
            background: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#F59E0B",
            fontSize: 10,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Menu em modo offline
        </div>
      )}

      <SidebarNav pathname={pathname} groups={navGroups} shellUrl={shellUrl} navVersao={navVersao} />
    </aside>
  );
}

function SidebarNav({
  pathname,
  groups,
  shellUrl,
  navVersao,
}: {
  pathname: string;
  groups: NavGroup[];
  shellUrl: string;
  navVersao: string;
}) {
  const allHrefs = useMemo(() => flattenHrefs(groups), [groups]);

  const activeHref = useMemo(() => {
    let best: string | null = null;
    let bestLen = -1;
    for (const it of allHrefs) {
      const matches = pathname === it.href || pathname.startsWith(it.href + "/");
      if (matches && it.href.length > bestLen) {
        best = it.href;
        bestLen = it.href.length;
      }
    }
    return best;
  }, [pathname, allHrefs]);

  const activeGroupId = useMemo(() => {
    if (!activeHref) return null;
    return allHrefs.find((it) => it.href === activeHref)?.groupId ?? null;
  }, [activeHref, allHrefs]);

  // Grupos recolhidos por padrão; só o grupo da rota ativa abre. Persistido
  // em localStorage e compartilhado entre shell e zonas — se a versao salva
  // divergir da versao atual do /api/nav, descarta o estado e volta ao
  // recolhido (o shell pode ter mudado a estrutura dos grupos).
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    for (const g of groups) m[g.id] = false;
    return m;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedVersao = window.localStorage.getItem(VERSAO_STORAGE_KEY);
      if (storedVersao !== navVersao) {
        window.localStorage.setItem(VERSAO_STORAGE_KEY, navVersao);
        window.localStorage.removeItem(GROUPS_STORAGE_KEY);
        return;
      }
      const raw = window.localStorage.getItem(GROUPS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setOpenMap((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // localStorage indisponível (modo privado, etc.) — segue recolhido.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navVersao]);

  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      for (const g of groups) {
        if (next[g.id] === undefined) next[g.id] = false;
      }
      return next;
    });
  }, [groups]);

  useEffect(() => {
    if (!activeGroupId) return;
    setOpenMap((prev) => (prev[activeGroupId] ? prev : { ...prev, [activeGroupId]: true }));
  }, [activeGroupId]);

  function toggleGroup(id: string) {
    setOpenMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage indisponível — o estado só não persiste entre loads.
      }
      return next;
    });
  }

  return (
    <nav
      className="sidebar-nav-scroll"
      style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}
    >
      {groups.map((g) => {
        if (!g.habilitado) {
          return (
            <div
              key={g.id}
              aria-disabled="true"
              title="Módulo não habilitado"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 8px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "var(--text-3)",
                opacity: 0.45,
                cursor: "not-allowed",
              }}
            >
              {g.icon && <g.icon size={11} />}
              <span>{g.title}</span>
            </div>
          );
        }

        const isOpen = openMap[g.id] ?? false;
        return (
          <details
            key={g.id}
            className="sidebar-disclosure"
            open={isOpen}
            onToggle={(event) => {
              const nextOpen = event.currentTarget.open;
              if (openMap[g.id] === nextOpen) return;
              toggleGroup(g.id);
            }}
            style={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            {g.title ? (
              <summary
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "10px 8px 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {g.icon && <g.icon size={11} style={{ color: "var(--text-3)" }} />}
                <span style={{ flex: 1 }}>{g.title}</span>
                <ChevronRight className="sidebar-disclosure-chevron" size={12} style={{ color: "var(--text-3)" }} />
              </summary>
            ) : (
              <summary aria-hidden="true" style={{ display: "none" }} />
            )}

            {g.items.map((it, idx) => {
              const Icon = it.icon;
              const active = it.href === activeHref;
              return (
                <NavigationLink
                  key={it.href ?? it.label + idx}
                  href={it.href}
                  pathname={pathname}
                  shellUrl={shellUrl}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 12px",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: active ? "var(--text)" : "var(--text-2)",
                    background: active ? "var(--surface-2)" : "transparent",
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    transition: "all var(--t)",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: -12,
                        top: 6,
                        bottom: 6,
                        width: 3,
                        background: "var(--brand)",
                        borderRadius: "0 4px 4px 0",
                      }}
                    />
                  )}
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ color: active ? "var(--brand)" : "currentColor" }} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                </NavigationLink>
              );
            })}
          </details>
        );
      })}
    </nav>
  );
}
