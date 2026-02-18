import { Container } from "@/app/(site)/components/layout/Container";
import { WHY_NPT_SECTION, WHY_NPT_TOKENS } from "@/config/whyNpt";
import { cn } from "@/lib/cn";
import { WhyNPTOrbitClient } from "./WhyNptOrbitClient";
import { WhyNptMobileStack } from "./WhyNptMobileStack";

export function WhyNptSection() {
  return (
    <section
      id={WHY_NPT_SECTION.id}
      className={cn("relative overflow-hidden", "bg-[color:var(--color-surface-0)]")}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 50% 30%, rgba(220,38,38,0.14), transparent 58%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 700px at 50% 120%, rgba(255,255,255,0.06), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.0),rgba(7,10,18,0.85))]" />
      </div>

      <Container className={WHY_NPT_TOKENS.section.containerClass}>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-3 h-[2px] w-14 bg-[color:var(--color-brand-500)]" />
          <div className="text-xs font-semibold tracking-wide text-white/60">
            {WHY_NPT_SECTION.kicker}
          </div>
          <h2 className={WHY_NPT_TOKENS.section.headingClass}>{WHY_NPT_SECTION.title}</h2>
          <p className={WHY_NPT_TOKENS.section.descriptionClass}>{WHY_NPT_SECTION.description}</p>
        </div>

        <div className="mt-8 hidden lg:block">
          <WhyNPTOrbitClient />
        </div>

        <div className="mt-8 lg:hidden">
          <WhyNptMobileStack />
        </div>
      </Container>
    </section>
  );
}
