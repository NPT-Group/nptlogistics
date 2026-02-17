import Image from "next/image";
import { cn } from "@/lib/cn";
import { WHY_NPT_CARDS, WHY_NPT_MOBILE_CARD_IDS, WHY_NPT_TOKENS } from "@/config/whyNpt";

const MOBILE_STACK_CARDS = WHY_NPT_CARDS.filter((card) => WHY_NPT_MOBILE_CARD_IDS.includes(card.id));

export function WhyNptMobileStack() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <div className="mx-auto mb-2">
        <Image
          src={WHY_NPT_TOKENS.solar.coreImageSrc}
          alt="NPT"
          width={1024}
          height={808}
          className="h-auto rounded-full object-cover drop-shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
          style={{ width: WHY_NPT_TOKENS.solar.mobileLogoWidth }}
        />
      </div>

      {MOBILE_STACK_CARDS.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={cn(
              "rounded-2xl border border-white/10",
              "bg-[linear-gradient(140deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]",
              "p-5 shadow-[0_18px_60px_rgba(2,6,23,0.55)] backdrop-blur-xl",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-white/60 uppercase">
                  {card.eyebrow}
                </div>
                <div className="mt-1 text-[15px] leading-snug font-semibold text-white/92">
                  {card.title}
                </div>
              </div>

              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  "border border-white/10 bg-white/5",
                )}
              >
                <Icon className="h-[18px] w-[18px] text-[color:var(--color-brand-500)]" />
              </span>
            </div>

            <div className="mt-3">
              <div className="text-[18px] font-bold tracking-tight text-white">{card.value}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-white/70">{card.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
