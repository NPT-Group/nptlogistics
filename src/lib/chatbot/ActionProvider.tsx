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

    // keep these to match react-chatbot-kit ctor signature; mark as used safely
    private _createClientMessage: any;
    private _stateRef: any;

    constructor(createChatBotMessage: any, setStateFunc: any, createClientMessage: any, stateRef: any) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;

      this._createClientMessage = createClientMessage;
      this._stateRef = stateRef;

      // prevent unused warnings in strict setups
      void this._createClientMessage;
      void this._stateRef;
    }

    private addMessage = (msg: any) => {
      this.setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    };

    // --- Intents ------------------------------------------------------------

    startOver = () => {
      this.addMessage(this.createChatBotMessage("What can I help you with?", { widget: "startWidget" }));
    };

    startQuote = () => {
      this.addMessage(
        this.createChatBotMessage("Sure — let’s start a quote. Choose an option:", {
          widget: "quoteWidget",
        }),
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

    // --- FAQ (placeholder) --------------------------------------------------

    searchFaq = (query: string) => {
      const q = (query || "").toLowerCase().trim();

      const match = FAQ.find((f) => f.question.toLowerCase().includes(q)) || FAQ.find((f) => (f.tags || []).some((t) => q.includes(t)));

      if (match) {
        this.addMessage(this.createChatBotMessage(match.answer));
        return;
      }

      this.addMessage(
        this.createChatBotMessage(`I’m not sure yet (we’re still building the help content). You can contact us at ${CONTACT_INFO.email} or ${CONTACT_INFO.phone}.`, { widget: "contactWidget" }),
      );
    };

    // --- Page interactivity examples ---------------------------------------

    goToQuotePage = () => {
      pageActions?.goTo("/quote");
    };

    prefillAndGoToQuote = (prefill: any) => {
      pageActions?.prefillQuote(prefill);
      pageActions?.goTo("/quote");
    };

    scrollToSection = (anchorId: string) => {
      pageActions?.scrollTo(anchorId);
    };
  };
}
