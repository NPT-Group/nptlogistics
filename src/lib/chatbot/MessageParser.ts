export default class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    const text = (message || "").trim().toLowerCase();

    // Minimal starter logic:
    if (!text) return;

    // Simple intent keywords (customize later)
    if (text.includes("quote")) return this.actionProvider.startQuote();
    if (text.includes("service")) return this.actionProvider.startServicesHelp();
    if (text.includes("contact") || text.includes("agent") || text.includes("human")) return this.actionProvider.showContact();

    // Fallback: treat as FAQ search (placeholder)
    return this.actionProvider.searchFaq(message);
  }
}
