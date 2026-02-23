// src/lib/chatbot/botConfig.tsx
"use client";

import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import StartWidget from "./widgets/StartWidget";
import ContactWidget from "./widgets/ContactWidget";
import ServicesWidget from "./widgets/ServicesWidget";
import QuoteWidget from "./widgets/QuoteWidget";
import IndustriesWidget from "./widgets/IndustriesWidget";
import CareersWidget from "./widgets/CareersWidget";
import WhyNptWidget from "./widgets/WhyNptWidget";
import TrackingWidget from "./widgets/TrackingWidget";

import SolutionsWidget from "./widgets/SolutionsWidget";
import CompanyWidget from "./widgets/CompanyWidget";
import ResourcesWidget from "./widgets/ResourcesWidget";
import SingleLinkWidget from "./widgets/SingleLinkWidget";

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
    { widgetName: "startWidget", widgetFunc: (props) => <StartWidget {...props} /> },
    { widgetName: "quoteWidget", widgetFunc: (props) => <QuoteWidget {...props} /> },
    { widgetName: "servicesWidget", widgetFunc: (props) => <ServicesWidget {...props} /> },
    { widgetName: "solutionsWidget", widgetFunc: (props) => <SolutionsWidget {...props} /> },
    { widgetName: "companyWidget", widgetFunc: (props) => <CompanyWidget {...props} /> },
    { widgetName: "resourcesWidget", widgetFunc: (props) => <ResourcesWidget {...props} /> },
    { widgetName: "singleLinkWidget", widgetFunc: (props) => <SingleLinkWidget {...props} /> },
    { widgetName: "contactWidget", widgetFunc: (props) => <ContactWidget {...props} /> },
    { widgetName: "industriesWidget", widgetFunc: (props) => <IndustriesWidget {...props} /> },
    { widgetName: "careersWidget", widgetFunc: (props) => <CareersWidget {...props} /> },
    { widgetName: "whyNptWidget", widgetFunc: (props) => <WhyNptWidget {...props} /> },
    { widgetName: "trackingWidget", widgetFunc: (props) => <TrackingWidget {...props} /> },
  ],
};

export default botConfig;
