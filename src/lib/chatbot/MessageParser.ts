// src/lib/chatbot/MessageParser.ts
export default class MessageParser {
  actionProvider: any;

  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  parse(message: string) {
    const text = message.toLowerCase();

    if (text.includes("quote") || text.includes("price") || text.includes("rate")) {
      return this.actionProvider.startQuote();
    }

    if (text.includes("track") || text.includes("tracking") || text.includes("status")) {
      return this.actionProvider.startTracking();
    }

    if (text.includes("career") || text.includes("job") || text.includes("hiring")) {
      return this.actionProvider.showCareers();
    }

    if (text.includes("driver")) {
      // direct, predictable navigation
      return this.actionProvider.goTo("/careers#drive");
    }

    if (text.includes("industry") || text.includes("industries")) {
      return this.actionProvider.showIndustries();
    }

    if (text.includes("why") || text.includes("reliable") || text.includes("on-time")) {
      return this.actionProvider.showWhyNpt();
    }

    if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
      return this.actionProvider.showContact();
    }

    return this.actionProvider.searchFaq(message);
  }
}
