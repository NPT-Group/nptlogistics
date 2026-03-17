// src/lib/chatbot/ActionProvider.tsx
import { FAQ, COMPANY_FACTS } from "./knowledgeBase";
import { getSectionCtas, searchNavMatches, type NavMatch } from "./navIndex";
import type { ActionProviderShape, PageSuggestionPayload } from "./chatbot.types";

type ChatbotMessageFactory = (message: string, options?: Record<string, unknown>) => unknown;

type StateUpdater = (
  updater: (prev: { messages: unknown[] }) => { messages: unknown[] } & Record<string, unknown>,
) => void;

type PageActions = {
  goTo: (href: string) => void;
  scrollTo: (anchorId: string) => void;
};

const LOW_SIGNAL_TOKENS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "for",
  "of",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "into",
  "through",
  "about",
  "how",
  "what",
  "when",
  "where",
  "why",
  "can",
  "do",
  "does",
  "did",
  "is",
  "are",
  "was",
  "were",
  "be",
  "we",
  "you",
  "your",
  "our",
  "i",
  "me",
  "my",
  "it",
  "this",
  "that",
  "these",
  "those",
  "handle",
  "handling",
  "work",
  "working",
  "help",
  "support",
]);

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

function strongTokensOf(s: string) {
  return tokensOf(s).filter((token) => {
    if (LOW_SIGNAL_TOKENS.has(token)) return false;
    if (token.length <= 2 && token !== "3pl") return false;
    return true;
  });
}

function overlapCount(a: readonly string[], b: readonly string[]) {
  const bSet = new Set(b);
  let count = 0;

  for (const token of a) {
    if (bSet.has(token)) count += 1;
  }

  return count;
}

export function makeActionProvider(pageActions?: PageActions) {
  return class ActionProvider implements ActionProviderShape {
    private createChatBotMessage: ChatbotMessageFactory;
    private setState: StateUpdater;

    constructor(createChatBotMessage: ChatbotMessageFactory, setStateFunc: StateUpdater) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }

    private addMessage = (msg: unknown) => {
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    };

    private sendText(message: string) {
      this.addMessage(this.createChatBotMessage(message));
    }

    private sendWidget<TPayload extends object>(
      message: string,
      widget: string,
      payload?: TPayload,
    ) {
      this.addMessage(
        this.createChatBotMessage(message, {
          widget,
          payload,
        }),
      );
    }

    goTo = (href: string) => {
      if (pageActions?.goTo) {
        pageActions.goTo(href);
        return;
      }

      if (typeof window !== "undefined") {
        window.location.href = href;
      }
    };

    goToFromNav = (labelHint: string, fallbackHref: string) => {
      const top = searchNavMatches(labelHint, 1)[0];
      this.goTo(top?.href ?? fallbackHref);
    };

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

      const payload: PageSuggestionPayload = veryConfident
        ? {
            title: "Suggested page",
            suggestions: [
              {
                label: this.formatMatchLabel(top),
                href: top.href,
                description: top.description,
              },
            ],
            secondaryLabel: "Show other options",
            secondaryAction: "startSolutions",
          }
        : {
            title: "Possible matches",
            suggestions: matches.map((m) => ({
              label: this.formatMatchLabel(m),
              href: m.href,
              description: m.description,
            })),
            secondaryLabel: somewhatConfident ? "Not these" : "Contact support",
            secondaryAction: somewhatConfident ? "startOver" : "showContact",
          };

      this.sendWidget(
        veryConfident ? `I found a likely page for that.` : `I found a few pages that might help.`,
        "pageSuggestionsWidget",
        payload,
      );

      return true;
    };

    suggestNavPage = (labelHint: string, fallbackHref: string, description?: string) => {
      this.sendWidget(`This page looks like the best fit:`, "pageSuggestionsWidget", {
        title: "Open page",
        suggestions: [
          {
            label: labelHint,
            href: fallbackHref,
            description,
          },
        ],
        secondaryLabel: "Show more options",
        secondaryAction: "startSolutions",
      } satisfies PageSuggestionPayload);
    };

    startOver = () => {
      this.sendWidget(
        `How can I help today? You can choose an option below or type your question.`,
        "startWidget",
      );
    };

    startQuote = () => {
      this.sendWidget(`You can request a quote on our quote page.`, "quoteWidget");
    };

    startTracking = () => {
      this.sendWidget(
        `You can open tracking and enter your shipment or reference number.`,
        "trackingWidget",
      );
    };

    startSolutions = () => {
      this.sendWidget(`Here are the main solution pages you can explore:`, "solutionsWidget");
    };

    showCompany = () => {
      this.sendWidget(`Here are a few company pages you might find useful:`, "companyWidget");
    };

    showResources = () => {
      this.sendWidget(`Here are some helpful resources:`, "resourcesWidget");
    };

    showContact = () => {
      this.sendWidget(`You can reach customer support here:`, "contactWidget");
    };

    showIndustries = () => {
      const { industries } = getSectionCtas();
      this.sendWidget(`You can browse the industries we support here:`, "industriesWidget", {
        viewAllHref: industries,
      });
    };

    showCareers = () => {
      const { careers } = getSectionCtas();
      this.sendWidget(`Looking for careers or driver opportunities?`, "careersWidget", {
        careersHref: careers,
      });
    };

    showWhyNpt = () => {
      this.sendWidget(
        `NPT has moved ${COMPANY_FACTS.loadsMoved} loads with ${COMPANY_FACTS.onTime} on-time performance across North America.`,
        "whyNptWidget",
      );
    };

    tryAnswerFaq = (query: string) => {
      const qN = normText(query);
      if (!qN) return false;

      const exact = FAQ.find((f) => normText(f.question) === qN);
      if (exact) {
        this.sendText(exact.answer);
        return true;
      }

      const qStrongTokens = strongTokensOf(qN);
      if (qStrongTokens.length === 0) return false;

      const ranked = FAQ.map((faq) => {
        const faqQuestion = normText(faq.question);
        const faqStrongTokens = strongTokensOf(faqQuestion);
        const faqTags = faq.tags.map((tag) => normText(tag)).filter(Boolean);

        let score = 0;

        if (faqQuestion.includes(qN)) score += 20;
        if (qN.includes(faqQuestion)) score += 16;

        const strongOverlap = overlapCount(qStrongTokens, faqStrongTokens);
        score += strongOverlap * 10;

        const tagOverlap = overlapCount(qStrongTokens, faqTags);
        score += tagOverlap * 14;

        for (const token of qStrongTokens) {
          if (faqQuestion === token) score += 20;
          if (faqStrongTokens.includes(token)) score += 6;
          if (faqTags.includes(token)) score += 8;
        }

        const overlapRatio = qStrongTokens.length > 0 ? strongOverlap / qStrongTokens.length : 0;

        if (overlapRatio >= 0.75) score += 12;
        else if (overlapRatio >= 0.5) score += 6;

        if (strongOverlap === 0 && tagOverlap === 0) score -= 20;
        if (strongOverlap === 1 && qStrongTokens.length >= 2) score -= 8;

        return { faq, score };
      })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      const best = ranked[0];
      const second = ranked[1];

      if (!best) return false;

      const confidentlyBetter = !second || best.score - second.score >= 8;
      const strongEnough = best.score >= 18;

      if (strongEnough && confidentlyBetter) {
        this.sendText(best.faq.answer);
        return true;
      }

      return false;
    };

    searchFaq = (query: string) => {
      if (this.tryAnswerFaq(query)) return;

      const suggested = this.suggestNavOptions(query, { limit: 3 });
      if (suggested) return;

      this.sendWidget(
        `I’m not sure I understood that, but customer support can help.`,
        "contactWidget",
      );
    };
  };
}
