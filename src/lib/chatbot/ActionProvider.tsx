// src/lib/chatbot/ActionProvider.tsx
import { FAQ, CONTACT_INFO } from "./knowledgeBase";
import { findNavHref, getSectionCtas } from "./navIndex";

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

    // --- NAV helpers --------------------------------------------------------

    goTo = (href: string) => {
      if (pageActions?.goTo) {
        pageActions.goTo(href);
        return;
      }
      if (typeof window !== "undefined") window.location.href = href;
    };

    goToFromNav = (query: string, fallbackHref?: string) => {
      const href = findNavHref(query) || fallbackHref;
      if (href) return this.goTo(href);
    };

    // --- Universal UI helpers ----------------------------------------------

    scrollToSection = (anchorId: string) => {
      if (pageActions?.scrollTo) return pageActions.scrollTo(anchorId);

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

    startSolutions = () => {
      this.addMessage(
        this.createChatBotMessage("Which solution are you looking for?", {
          widget: "solutionsWidget",
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

    showCompany = () => {
      this.addMessage(
        this.createChatBotMessage("Here are a few helpful company links:", {
          widget: "companyWidget",
        }),
      );
    };

    showResources = () => {
      this.addMessage(
        this.createChatBotMessage("Resources that might help:", {
          widget: "resourcesWidget",
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
      const { industries } = getSectionCtas();
      this.addMessage(
        this.createChatBotMessage("Pick an industry (or view them all):", {
          widget: "industriesWidget",
          props: { viewAllHref: industries },
        }),
      );
    };

    showCareers = () => {
      const { careers } = getSectionCtas();
      this.addMessage(
        this.createChatBotMessage("Want to see driver roles or job listings?", {
          widget: "careersWidget",
          props: { careersHref: careers },
        }),
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

    // --- Specific solution helpers (NAV-driven) ----------------------------

    goToTruckload = () => this.goToFromNav("Truckload (TL)", "/services/truckload");
    goToLtl = () => this.goToFromNav("Less-Than-Truckload (LTL)", "/services/ltl");
    goToIntermodal = () => this.goToFromNav("Intermodal", "/services/intermodal");
    goToExpedited = () =>
      this.goToFromNav("Expedited & Specialized (ES)", "/services/expedited-specialized");
    goToHazmat = () => this.goToFromNav("Hazardous Materials (HAZMAT)", "/services/hazmat");
    goToTemp = () => this.goToFromNav("Temperature-Controlled", "/services/temperature-controlled");
    goToCrossBorder = () => this.goToFromNav("Cross-Border & Global", "/services/cross-border");
    goToValueAdded = () => this.goToFromNav("Logistics & Value-Added", "/services/value-added");

    // --- FAQ ---------------------------------------------------------------

    searchFaq = (query: string) => {
      const q = (query || "").toLowerCase().trim();

      const match =
        FAQ.find((f) => f.question.toLowerCase().includes(q)) ||
        FAQ.find((f) => (f.tags || []).some((t) => q.includes(t)));

      // If no FAQ match, try NAV as a “smart router”
      if (!match) {
        const href = findNavHref(query);
        if (href) {
          this.addMessage(
            this.createChatBotMessage("I think this page will help:", {
              widget: "singleLinkWidget",
              props: { label: "Open page", href },
            }),
          );
          return;
        }
      }

      if (match) {
        this.addMessage(this.createChatBotMessage(match.answer));
        return;
      }

      this.addMessage(
        this.createChatBotMessage(
          `I’m not sure. For any inquiry, you can contact us at ${CONTACT_INFO.email} or ${CONTACT_INFO.phone}.`,
          { widget: "contactWidget" },
        ),
      );
    };

    // --- Quote helpers ------------------------------------------------------

    prefillAndGoToQuote = (prefill: any) => {
      pageActions?.prefillQuote?.(prefill);
      this.goTo("/quote");
    };

    goToQuotePage = () => this.goTo("/quote");
  };
}
