// src/lib/chatbot/MessageParser.ts
export default class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    const text = (message || "").toLowerCase();

    // Quote
    if (text.includes("quote") || text.includes("price") || text.includes("rate")) {
      return this.actionProvider.startQuote();
    }

    // Tracking
    if (text.includes("track") || text.includes("tracking") || text.includes("status")) {
      return this.actionProvider.startTracking();
    }

    // Careers
    if (text.includes("career") || text.includes("job") || text.includes("hiring")) {
      return this.actionProvider.showCareers();
    }
    if (text.includes("driver")) {
      return this.actionProvider.goToFromNav("Driver Opportunities", "/careers#drive");
    }

    // Industries
    if (text.includes("industry") || text.includes("industries")) {
      return this.actionProvider.showIndustries();
    }

    // Company / resources
    if (
      text.includes("about") ||
      text.includes("company") ||
      text.includes("locations") ||
      text.includes("network")
    ) {
      return this.actionProvider.showCompany();
    }
    if (text.includes("guide") || text.includes("resources") || text.includes("shipping guide")) {
      return this.actionProvider.showResources();
    }
    if (text.includes("faq") || text.includes("faqs")) {
      return this.actionProvider.goToFromNav("FAQs", "/resources/faqs");
    }

    // Why NPT
    if (text.includes("why") || text.includes("reliable") || text.includes("on-time")) {
      return this.actionProvider.showWhyNpt();
    }

    // Contact
    if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
      return this.actionProvider.showContact();
    }

    // --- Solutions / services (new) ---------------------------------------
    if (text.includes("solution") || text.includes("service")) {
      return this.actionProvider.startSolutions();
    }

    // Mode keywords
    if (text.includes("ltl")) return this.actionProvider.goToLtl();
    if (text.includes("truckload") || text.includes("tl") || text.includes("ftl"))
      return this.actionProvider.goToTruckload();
    if (text.includes("intermodal") || text.includes("rail") || text.includes("train"))
      return this.actionProvider.goToIntermodal();

    if (
      text.includes("expedite") ||
      text.includes("expedited") ||
      text.includes("hot shot") ||
      text.includes("rush")
    )
      return this.actionProvider.goToExpedited();

    if (text.includes("hazmat") || text.includes("hazard") || text.includes("tdg"))
      return this.actionProvider.goToHazmat();

    if (
      text.includes("temperature") ||
      text.includes("temp-controlled") ||
      text.includes("reefer") ||
      text.includes("cold chain")
    )
      return this.actionProvider.goToTemp();

    if (
      text.includes("cross-border") ||
      text.includes("customs") ||
      text.includes("mexico") ||
      text.includes("canada") ||
      text.includes("border")
    )
      return this.actionProvider.goToCrossBorder();

    if (
      text.includes("warehouse") ||
      text.includes("warehousing") ||
      text.includes("distribution") ||
      text.includes("managed capacity") ||
      text.includes("dedicated")
    )
      return this.actionProvider.goToValueAdded();

    // Fall back to FAQ search (and NAV routing fallback is inside ActionProvider.searchFaq)
    return this.actionProvider.searchFaq(message);
  }
}
