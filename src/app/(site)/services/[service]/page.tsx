// src/app/(site)/services/[service]/page.tsx
import { notFound } from "next/navigation";
import {
  buildServiceMetadata,
  getServiceBySlug,
  getServiceKeys,
  SERVICES,
} from "@/config/services";
import { ServicePage } from "./_components/ServicePage";

type RouteParams = { service: string };

export function generateStaticParams() {
  return getServiceKeys().map((key) => ({ service: SERVICES[key].slug }));
}

export async function generateMetadata({ params }: { params: RouteParams | Promise<RouteParams> }) {
  const { service } = await Promise.resolve(params);
  const model = getServiceBySlug(service);
  if (!model) return {};
  return buildServiceMetadata(model);
}

export default async function ServiceRoutePage({
  params,
}: {
  params: RouteParams | Promise<RouteParams>;
}) {
  const { service } = await Promise.resolve(params);
  const model = getServiceBySlug(service);
  if (!model) notFound();
  return <ServicePage model={model} />;
}
