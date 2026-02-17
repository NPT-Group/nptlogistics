"use client";

import dynamic from "next/dynamic";

const WhyNPTOrbit = dynamic(
  () => import("./WhyNptOrbitVisualization").then((module) => module.WhyNPTOrbitVisualization),
  { ssr: false },
);

export function WhyNPTOrbitClient() {
  return <WhyNPTOrbit />;
}
