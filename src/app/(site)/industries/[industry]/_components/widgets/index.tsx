import type { IndustryWidgetType } from "@/config/industryPages";
import { DemandSurgeWidget } from "./DemandSurgeWidget";
import { FreshnessPreservationWidget } from "./FreshnessPreservationWidget";
import { HeavyHaulRouteWidget } from "./HeavyHaulRouteWidget";
import { LoadBalanceAxleWidget } from "./LoadBalanceAxleWidget";
import { LoadOptimizationWidget } from "./LoadOptimizationWidget";
import { TransportProtectionWidget } from "./TransportProtectionWidget";

export function IndustrySectionWidget({
  widgetType,
  accentColor,
}: {
  widgetType: IndustryWidgetType;
  accentColor: string;
}) {
  switch (widgetType) {
    case "transport-protection":
      return <TransportProtectionWidget accentColor={accentColor} />;
    case "load-optimization":
      return <LoadOptimizationWidget accentColor={accentColor} />;
    case "demand-surge":
      return <DemandSurgeWidget accentColor={accentColor} />;
    case "freshness-preservation":
      return <FreshnessPreservationWidget accentColor={accentColor} />;
    case "heavy-haul-route":
      return <HeavyHaulRouteWidget accentColor={accentColor} />;
    case "load-balance-axle":
      return <LoadBalanceAxleWidget accentColor={accentColor} />;
    default:
      return null;
  }
}
