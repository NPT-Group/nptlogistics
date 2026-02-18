// src/lib/chatbot/ActionProvider.tsx
import { FAQ, CONTACT_INFO } from "./knowledgeBase";

type PageActions = {
  goTo: (href: string) => void;
  prefillQuote: (patch: any) => void;
  scrollTo: (anchorId: string) => void;
  openContactModal: () => void;
};

export function makeActionProvider(pageActions?: PageActions) {
  return class ActionProvider {
    private createChatBotMessage: any;
    private setState: any;

    private _createClientMessage: any;
    private _stateRef: any;

    constructor(
      createChatBotMessage: any,
      setStateFunc: any,
      createClientMessage: any,
      stateRef: any,
    ) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;

      this._createClientMessage = createClientMessage;
      this._stateRef = stateRef;

      void this._createClientMessage;
      void this._stateRef;
    }

    private addMessage = (msg: any) => {
      this.setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    };

    // --- Universal navigation helpers --------------------------------------

    goTo = (href: string) => {
      // Primary: Next router push via pageActions
      if (pageActions?.goTo) {
        pageActions.goTo(href);
        return;
      }

      // Fallback: hard navigation
      if (typeof window !== "undefined") {
        window.location.href = href;
      }
    };

    scrollToSection = (anchorId: string) => {
      // Preferred: page listens to command store (your useChatActions implementation)
      if (pageActions?.scrollTo) {
        pageActions.scrollTo(anchorId);
        return;
      }

      // Fallback: try DOM
      if (typeof document !== "undefined") {
        const el =
          document.getElementById(anchorId) ||
          document.querySelector(`[data-anchor="${anchorId}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // --- Intents ------------------------------------------------------------

    startOver = () => {
      this.addMessage(
        this.createChatBotMessage("What can I help you with?", { widget: "startWidget" }),
      );
    };

    startQuote = () => {
      this.addMessage(
        this.createChatBotMessage("Sure — let’s start a quote. Choose an option:", {
          widget: "quoteWidget",
        }),
      );
    };

    startTracking = () => {
      this.addMessage(
        this.createChatBotMessage(
          "No problem — open tracking and enter your shipment / reference number.",
          { widget: "trackingWidget" },
        ),
      );
    };

    startServicesHelp = () => {
      this.addMessage(
        this.createChatBotMessage("I can help you pick the right service. Start here:", {
          widget: "servicesWidget",
        }),
      );
    };

    showContact = () => {
      this.addMessage(
        this.createChatBotMessage("Here’s how to contact our team:", {
          widget: "contactWidget",
        }),
      );
    };

    showIndustries = () => {
      this.addMessage(
        this.createChatBotMessage(
          "We support automotive, manufacturing, retail, food & beverage, industrial energy, and steel & aluminum sectors.",
          { widget: "industriesWidget" },
        ),
      );
    };

    showCareers = () => {
      this.addMessage(
        this.createChatBotMessage(
          "We’re hiring drivers, dispatch, cross-border specialists, and operations professionals.",
          { widget: "careersWidget" },
        ),
      );
    };

    showWhyNpt = () => {
      this.addMessage(
        this.createChatBotMessage(
          "NPT has moved over 250,000 loads with 98% on-time performance across North America.",
          { widget: "whyNptWidget" },
        ),
      );
    };

    // --- FAQ ---------------------------------------------------------------

    searchFaq = (query: string) => {
      const q = (query || "").toLowerCase().trim();

      const match =
        FAQ.find((f) => f.question.toLowerCase().includes(q)) ||
        FAQ.find((f) => (f.tags || []).some((t) => q.includes(t)));

      if (match) {
        this.addMessage(this.createChatBotMessage(match.answer));
        return;
      }

      this.addMessage(
        this.createChatBotMessage(
          `I’m not sure yet (we’re still building the help content). You can contact us at ${CONTACT_INFO.email} or ${CONTACT_INFO.phone}.`,
          { widget: "contactWidget" },
        ),
      );
    };

    // --- Quote helpers ------------------------------------------------------

    prefillAndGoToQuote = (prefill: any) => {
      pageActions?.prefillQuote?.(prefill);
      this.goTo("/quote");
    };

    // Kept for compatibility (if anything still calls it)
    goToQuotePage = () => {
      this.goTo("/quote");
    };
  };
}
