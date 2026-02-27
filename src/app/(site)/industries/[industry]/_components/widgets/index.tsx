import type { IndustryWidgetType } from "@/config/industryPages";
import { ColdChainJourneyWidget } from "./ColdChainJourneyWidget";
import { FreshnessPreservationWidget } from "./FreshnessPreservationWidget";
import { DeliveryPromiseWidget } from "./DeliveryPromiseWidget";
import { DemandSurgeWidget } from "./DemandSurgeWidget";
import { DeliveryWindowWidget } from "./DeliveryWindowWidget";
import { HeavyHaulRouteWidget } from "./HeavyHaulRouteWidget";
import { LoadBalanceAxleWidget } from "./LoadBalanceAxleWidget";
import { LoadOptimizationWidget } from "./LoadOptimizationWidget";
import { LoadTypeWidget } from "./LoadTypeWidget";
import { ProjectPhaseWidget } from "./ProjectPhaseWidget";
import { TransportProtectionWidget } from "./TransportProtectionWidget";
import { VisibilityCheckpointsWidget } from "./VisibilityCheckpointsWidget";

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
    case "delivery-window":
      return <DeliveryWindowWidget accentColor={accentColor} />;
    case "visibility-checkpoints":
      return <VisibilityCheckpointsWidget accentColor={accentColor} />;
    case "load-optimization":
      return <LoadOptimizationWidget accentColor={accentColor} />;
    case "delivery-promise":
      return <DeliveryPromiseWidget accentColor={accentColor} />;
    case "demand-surge":
      return <DemandSurgeWidget accentColor={accentColor} />;
    case "cold-chain-journey":
      return <ColdChainJourneyWidget accentColor={accentColor} />;
    case "freshness-preservation":
      return <FreshnessPreservationWidget accentColor={accentColor} />;
    case "project-phase":
      return <ProjectPhaseWidget accentColor={accentColor} />;
    case "heavy-haul-route":
      return <HeavyHaulRouteWidget accentColor={accentColor} />;
    case "load-type":
      return <LoadTypeWidget accentColor={accentColor} />;
    case "load-balance-axle":
      return <LoadBalanceAxleWidget accentColor={accentColor} />;
    default:
      return null;
  }
}
