"use client";

import dynamic from "next/dynamic";

const WhyNPTOrbit = dynamic(
  () => import("./WhyNptOrbit").then((module) => module.WhyNPTOrbit),
  { ssr: false },
);

export function WhyNPTOrbitClient() {
  return <WhyNPTOrbit />;
}
