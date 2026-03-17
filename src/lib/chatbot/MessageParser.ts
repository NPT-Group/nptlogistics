// src/lib/chatbot/MessageParser.ts
import type { ActionProviderShape } from "./chatbot.types";

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

function hasAnyToken(tokens: string[], candidates: readonly string[]) {
  const set = new Set(tokens);
  return candidates.some((candidate) => set.has(candidate));
}

export default class MessageParser {
  private actionProvider: ActionProviderShape;

  constructor(actionProvider: ActionProviderShape) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    const tokens = tokensOf(message);

    if (
      hasAnyToken(tokens, ["quote", "quotes", "pricing", "price", "rate", "rates", "cost", "costs"])
    ) {
      return this.actionProvider.startQuote();
    }

    if (this.actionProvider.tryAnswerFaq(message)) return;

    if (hasAnyToken(tokens, ["track", "tracking", "status"])) {
      return this.actionProvider.startTracking();
    }

    if (hasAnyToken(tokens, ["career", "careers", "job", "jobs", "hiring"])) {
      return this.actionProvider.showCareers();
    }

    if (hasAnyToken(tokens, ["industry", "industries"])) {
      return this.actionProvider.showIndustries();
    }

    if (
      hasAnyToken(tokens, [
        "about",
        "company",
        "location",
        "locations",
        "network",
        "safety",
        "compliance",
      ])
    ) {
      return this.actionProvider.showCompany();
    }

    if (hasAnyToken(tokens, ["guide", "guides", "resource", "resources"])) {
      return this.actionProvider.showResources();
    }

    if (hasAnyToken(tokens, ["faq", "faqs", "question", "questions"])) {
      return this.actionProvider.showResources();
    }

    if (hasAnyToken(tokens, ["why", "reliable", "reliability", "ontime", "on-time"])) {
      return this.actionProvider.showWhyNpt();
    }

    if (hasAnyToken(tokens, ["contact", "email", "support", "agent"])) {
      return this.actionProvider.showContact();
    }

    if (hasAnyToken(tokens, ["solution", "solutions", "service", "services"])) {
      return this.actionProvider.startSolutions();
    }

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
        "Rail and truck solutions for balanced cost and capacity.",
      );
    }

    if (hasAnyToken(tokens, ["expedite", "expedited", "rush", "hotshot", "specialized"])) {
      return this.actionProvider.suggestNavPage(
        "Expedited & Specialized",
        "/services/expedited-specialized",
        "Priority freight and specialized equipment solutions.",
      );
    }

    if (hasAnyToken(tokens, ["hazmat", "hazardous", "regulated"])) {
      return this.actionProvider.suggestNavPage(
        "Hazardous Materials (HAZMAT)",
        "/services/hazmat",
        "Compliant hazmat movement and documentation.",
      );
    }

    if (hasAnyToken(tokens, ["temperature", "reefer", "cold", "temp"])) {
      return this.actionProvider.suggestNavPage(
        "Temperature-Controlled",
        "/services/temperature-controlled",
        "Controlled-temperature freight solutions.",
      );
    }

    if (hasAnyToken(tokens, ["cross", "border", "customs", "canada", "usa", "mexico"])) {
      return this.actionProvider.suggestNavPage(
        "Cross-Border & Global",
        "/services/cross-border",
        "Cross-border execution and global freight support.",
      );
    }

    if (hasAnyToken(tokens, ["warehouse", "warehousing", "distribution", "storage"])) {
      return this.actionProvider.suggestNavPage(
        "Logistics & Value-Added",
        "/services/value-added",
        "Warehousing, managed capacity, and value-added logistics.",
      );
    }

    const suggested = this.actionProvider.suggestNavOptions(message, { limit: 3 });
    if (suggested) return;

    return this.actionProvider.searchFaq(message);
  }
}
