"use client";

import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import StartWidget from "./widgets/StartWidget";
import ContactWidget from "./widgets/ContactWidget";
import ServicesWidget from "./widgets/ServicesWidget";
import QuoteWidget from "./widgets/QuoteWidget";

// Minimal config type that matches what Chatbot expects (avoids IConfig mismatch)
type BotConfig = {
  botName: string;
  initialMessages: any[];
  customStyles?: Record<string, any>;
  widgets?: Array<{
    widgetName: string;
    widgetFunc: (props: any) => React.ReactNode;
    mapStateToProps?: string[];
    props?: Record<string, any>;
  }>;
};

const botName = "NPT Assistant";

export const botConfig: BotConfig = {
  botName,
  initialMessages: [
    createChatBotMessage(`Hi — I’m ${botName}. What can I help you with today?`, {
      widget: "startWidget",
    }),
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#111827" },
    chatButton: { backgroundColor: "#111827" },
  },
  widgets: [
    { widgetName: "startWidget", widgetFunc: (props: any) => <StartWidget {...props} /> },
    { widgetName: "quoteWidget", widgetFunc: (props: any) => <QuoteWidget {...props} /> },
    { widgetName: "servicesWidget", widgetFunc: (props: any) => <ServicesWidget {...props} /> },
    { widgetName: "contactWidget", widgetFunc: (props: any) => <ContactWidget {...props} /> },
  ],
};

export default botConfig;
