"use client";

import * as React from "react";
import BlockNote from "@/components/BlockNote";
import type { PartialBlock } from "@blocknote/core";

export default function Home() {
  const [doc, setDoc] = React.useState<PartialBlock[] | null>(null);
  const [title, setTitle] = React.useState("");

  async function save() {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: doc ?? [] }),
    });

    if (!res.ok) throw new Error("Failed to save");
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="mb-4 w-full rounded-xl border px-4 py-3 text-2xl outline-none" />

      <BlockNote onChange={setDoc} />

      <button onClick={save} className="mt-4 rounded-xl bg-black px-4 py-2 text-white">
        Publish
      </button>
    </div>
  );
}
