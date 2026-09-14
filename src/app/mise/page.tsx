import { MiseOverview } from "@/components/mise/MiseOverview";
import { UnitSelector } from "@/components/mise/UnitSelector";
import { getRecentChecklists } from "@/lib/mise/checklists";
import { hoursFromNowIso, nowIso } from "@/lib/mise/dates";
import { getExpiredActiveCount, getExpiringSoon24hCount, getPrintedThisMonth, getUpcomingLabels } from "@/lib/mise/labels";
import { getActivePrintPointsCount } from "@/lib/mise/printPoints";
import { getPrinterRanking } from "@/lib/mise/ranking";
import { getUnits, resolveUnitFilter } from "@/lib/mise/units";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ unidade?: string }>;

export default async function MisePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { unitIds, selected } = resolveUnitFilter(sp.unidade);
  const now = nowIso();
  const in24h = hoursFromNowIso(24);

  const [units, expiringSoon, expiredActive, printedMonth, printersActive, upcoming, ranking, checklists] = await Promise.all([
    getUnits(),
    getExpiringSoon24hCount(unitIds, now, in24h),
    getExpiredActiveCount(unitIds, now),
    getPrintedThisMonth(unitIds),
    getActivePrintPointsCount(unitIds),
    getUpcomingLabels(unitIds, 50),
    getPrinterRanking(unitIds),
    getRecentChecklists(unitIds, 10),
  ]);

  return <MiseOverview units={units} selected={selected} expiringSoon={expiringSoon} expiredActive={expiredActive} printedMonth={printedMonth} printersActive={printersActive} upcoming={upcoming} ranking={ranking} checklists={checklists} referenceTime={now} selector={<UnitSelector units={units} selected={selected} />} />;
}
