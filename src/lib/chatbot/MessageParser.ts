// src/lib/chatbot/MessageParser.ts
function normText(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(s: string) {
  return normText(s).split(" ").filter(Boolean);
}

function hasAnyToken(tokens: string[], candidates: string[]) {
  const set = new Set(tokens);
  return candidates.some((c) => set.has(c));
}

export default class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    const tokens = tokensOf(message);

    // 0) FAQ should win if user is asking an exact/near FAQ question
    // (prevents keyword rules from hijacking intent)
    if (this.actionProvider?.tryAnswerFaq?.(message)) return;

    // Quote (token-based; prevents "opeRATE" => rate bug)
    if (
      hasAnyToken(tokens, ["quote", "quotes", "pricing", "price", "rate", "rates", "cost", "costs"])
    ) {
      return this.actionProvider.startQuote();
    }

    // Tracking
    if (hasAnyToken(tokens, ["track", "tracking", "status"])) {
      return this.actionProvider.startTracking();
    }

    // Careers
    if (hasAnyToken(tokens, ["career", "careers", "job", "jobs", "hiring"])) {
      return this.actionProvider.showCareers();
    }
    if (tokens.includes("driver") || tokens.includes("drivers")) {
      return this.actionProvider.suggestNavPage(
        "Driver Opportunities",
        "/careers#drive",
        "Driver roles and requirements.",
      );
    }

    // Industries
    if (hasAnyToken(tokens, ["industry", "industries"])) {
      return this.actionProvider.showIndustries();
    }

    // Company / resources
    if (
      hasAnyToken(tokens, [
        "about",
        "company",
        "locations",
        "location",
        "network",
        "safety",
        "compliance",
      ])
    ) {
      return this.actionProvider.showCompany();
    }

    if (hasAnyToken(tokens, ["guide", "guides", "resources"])) {
      return this.actionProvider.showResources();
    }

    if (hasAnyToken(tokens, ["faq", "faqs"])) {
      // If it's a generic "FAQ" ask, still show the page suggestion.
      // (If they asked an actual FAQ question, tryAnswerFaq above would have answered it already.)
      return this.actionProvider.suggestNavPage(
        "FAQs",
        "/resources/faqs",
        "Fast answers to common questions.",
      );
    }

    // Why NPT
    if (hasAnyToken(tokens, ["why", "reliable", "reliability", "on", "ontime", "on-time"])) {
      return this.actionProvider.showWhyNpt();
    }

    // Contact
    if (hasAnyToken(tokens, ["contact", "email", "phone", "call"])) {
      return this.actionProvider.showContact();
    }

    // Solutions / services (broad)
    if (hasAnyToken(tokens, ["solution", "solutions", "service", "services"])) {
      return this.actionProvider.startSolutions();
    }

    // --- Keyword rules -> Suggest, don't route --------------------------------

    if (tokens.includes("ltl")) {
      return this.actionProvider.suggestNavPage(
        "Less-Than-Truckload (LTL)",
        "/services/ltl",
        "Cost-efficient LTL shipping across lanes.",
      );
    }

    if (tokens.includes("truckload") || tokens.includes("tl") || tokens.includes("ftl")) {
      return this.actionProvider.suggestNavPage(
        "Truckload (TL)",
        "/services/truckload",
        "Full truckload shipping for time-critical freight.",
      );
    }

    if (hasAnyToken(tokens, ["intermodal", "rail", "train"])) {
      return this.actionProvider.suggestNavPage(
        "Intermodal",
        "/services/intermodal",
        "Rail + truck for balanced cost and capacity.",
      );
    }

    if (hasAnyToken(tokens, ["expedite", "expedited", "rush", "hot", "shot"])) {
      return this.actionProvider.suggestNavPage(
        "Expedited & Specialized (ES)",
        "/services/expedited-specialized",
        "Priority freight and specialized vehicle execution.",
      );
    }

    if (hasAnyToken(tokens, ["hazmat", "hazard", "tdg"])) {
      return this.actionProvider.suggestNavPage(
        "Hazardous Materials (HAZMAT)",
        "/services/hazmat",
        "Compliant hazmat movement and documentation.",
      );
    }

    if (hasAnyToken(tokens, ["temperature", "temp", "tempcontrolled", "reefer", "cold", "chain"])) {
      return this.actionProvider.suggestNavPage(
        "Temperature-Controlled",
        "/services/temperature-controlled",
        "Refrigerated and controlled-temperature freight.",
      );
    }

    if (hasAnyToken(tokens, ["cross", "border", "customs", "mexico", "canada", "usa"])) {
      return this.actionProvider.suggestNavPage(
        "Cross-Border & Global",
        "/services/cross-border",
        "Cross-border execution + global modes as needed.",
      );
    }

    if (
      hasAnyToken(tokens, ["warehouse", "warehousing", "distribution", "dedicated", "capacity"])
    ) {
      return this.actionProvider.suggestNavPage(
        "Logistics & Value-Added",
        "/services/value-added",
        "Warehousing, managed capacity, dedicated, and projects.",
      );
    }

    // --- Smart fallback: try NAV matching and suggest 1–3 pages --------------
    const suggested = this.actionProvider.suggestNavOptions(message, { limit: 3 });
    if (suggested) return;

    // Final fallback: FAQ search (now safe, because tryAnswerFaq is robust)
    return this.actionProvider.searchFaq(message);
  }
}
