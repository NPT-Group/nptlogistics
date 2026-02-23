// src/lib/chatbot/ActionProvider.tsx
import { FAQ, CONTACT_INFO } from "./knowledgeBase";
import { getSectionCtas, searchNavMatches, type NavMatch } from "./navIndex";

type PageActions = {
  goTo: (href: string) => void;
  prefillQuote: (patch: any) => void;
  scrollTo: (anchorId: string) => void;
  openContactModal: () => void;
};

function normText(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(s: string) {
  return normText(s).split(" ").filter(Boolean);
}

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

    // --- Routing ------------------------------------------------------------

    goTo = (href: string) => {
      if (pageActions?.goTo) {
        pageActions.goTo(href);
        return;
      }
      if (typeof window !== "undefined") window.location.href = href;
    };

    goToFromNav = (labelHint: string, fallbackHref: string) => {
      const top = searchNavMatches(labelHint, 1)[0];
      this.goTo(top?.href ?? fallbackHref);
    };

    // --- Suggestion UX (NO silent navigation) ------------------------------

    private formatMatchLabel(match: NavMatch) {
      return `${match.label} (${match.sectionLabel})`;
    }

    suggestNavOptions = (userText: string, opts?: { limit?: number }) => {
      const limit = opts?.limit ?? 3;
      const matches = searchNavMatches(userText, limit);

      const top = matches[0];
      if (!top || top.score < 7) return false;

      const second = matches[1];

      const veryConfident = !second || top.score - second.score >= 8;
      const somewhatConfident = !!second && top.score - second.score >= 4;

      if (veryConfident) {
        this.addMessage(
          this.createChatBotMessage(
            `Looks like you might mean **${top.label}** under **${top.sectionLabel}**. Want to open it?`,
            {
              widget: "pageSuggestionsWidget",
              payload: {
                title: "Open a page",
                suggestions: [
                  {
                    label: this.formatMatchLabel(top),
                    href: top.href,
                    description: top.description,
                  },
                ],
                secondaryLabel: "Show other options",
                secondaryAction: "startSolutions",
              },
            },
          ),
        );
        return true;
      }

      if (somewhatConfident) {
        this.addMessage(
          this.createChatBotMessage(`I found a couple matches for that — which one did you mean?`, {
            widget: "pageSuggestionsWidget",
            payload: {
              title: "Choose a page",
              suggestions: matches.map((m) => ({
                label: this.formatMatchLabel(m),
                href: m.href,
                description: m.description,
              })),
              secondaryLabel: "Not now",
              secondaryAction: "startOver",
            },
          }),
        );
        return true;
      }

      this.addMessage(
        this.createChatBotMessage(
          `Not sure I got that exactly — but one of these pages might help:`,
          {
            widget: "pageSuggestionsWidget",
            payload: {
              title: "Possible matches",
              suggestions: matches.map((m) => ({
                label: this.formatMatchLabel(m),
                href: m.href,
                description: m.description,
              })),
              secondaryLabel: "Talk to an agent",
              secondaryAction: "showContact",
            },
          },
        ),
      );
      return true;
    };

    suggestNavPage = (labelHint: string, fallbackHref: string, description?: string) => {
      this.addMessage(
        this.createChatBotMessage(`Are you looking for **${labelHint}**?`, {
          widget: "pageSuggestionsWidget",
          payload: {
            title: "Open a page",
            suggestions: [
              {
                label: labelHint,
                href: fallbackHref,
                description,
              },
            ],
            secondaryLabel: "Browse solutions",
            secondaryAction: "startSolutions",
          },
        }),
      );
    };

    // --- Universal UI helpers ----------------------------------------------

    scrollToSection = (anchorId: string) => {
      if (pageActions?.scrollTo) {
        pageActions.scrollTo(anchorId);
        return;
      }

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

    // --- Quote helpers ------------------------------------------------------

    prefillAndGoToQuote = (prefill: any) => {
      pageActions?.prefillQuote?.(prefill);
      this.goTo("/quote");
    };

    goToQuotePage = () => this.goTo("/quote");

    // --- FAQ: best-possible matching ---------------------------------------

    /**
     * Only answers if a FAQ match exists.
     * Returns true if it answered, otherwise false.
     */
    tryAnswerFaq = (query: string) => {
      const qN = normText(query);
      if (!qN) return false;

      // 1) Exact normalized match
      const exact = FAQ.find((f) => normText(f.question) === qN);
      if (exact) {
        this.addMessage(this.createChatBotMessage(exact.answer));
        return true;
      }

      // 2) Containment match (either direction), prefers longer overlap
      const candidates = FAQ.map((f) => {
        const fq = normText(f.question);
        let score = 0;

        if (fq.includes(qN)) score += 50;
        if (qN.includes(fq)) score += 40;

        // 3) Token overlap score
        const qT = new Set(tokensOf(qN));
        const fT = new Set(tokensOf(fq));
        let overlap = 0;
        qT.forEach((t) => {
          if (fT.has(t)) overlap += 1;
        });
        score += overlap * 6;

        // 4) Tag relevance (query contains tag tokens)
        const tags = (f.tags || []).map(normText);
        for (const tag of tags) {
          if (!tag) continue;
          if (qN.includes(tag)) score += 8;
        }

        return { f, score };
      })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);

      const best = candidates[0];
      if (best && best.score >= 18) {
        this.addMessage(this.createChatBotMessage(best.f.answer));
        return true;
      }

      return false;
    };

    /**
     * Legacy name kept so existing calls still work:
     * - answers FAQ if possible
     * - else tries nav suggestions
     * - else contact fallback
     */
    searchFaq = (query: string) => {
      if (this.tryAnswerFaq(query)) return;

      const suggested = this.suggestNavOptions(query, { limit: 3 });
      if (suggested) return;

      this.addMessage(
        this.createChatBotMessage(
          `I’m not sure. For any inquiry, you can contact us at ${CONTACT_INFO.email} or ${CONTACT_INFO.phone}.`,
          { widget: "contactWidget" },
        ),
      );
    };
  };
}
