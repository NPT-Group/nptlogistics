"use client";

import { CONTACT_INFO } from "../knowledgeBase";

export default function ContactWidget() {
  return (
    <div className="space-y-2 text-sm">
      <div>
        Email:{" "}
        <a className="underline" href={`mailto:${CONTACT_INFO.email}`}>
          {CONTACT_INFO.email}
        </a>
      </div>
      <div>
        Phone:{" "}
        <a className="underline" href={`tel:${CONTACT_INFO.phone}`}>
          {CONTACT_INFO.phone}
        </a>
      </div>
    </div>
  );
}
