"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/cn";
import {
  WHY_NPT_CARDS,
  WHY_NPT_DESKTOP_CARD_IDS,
  WHY_NPT_LOGISTICS_ORBIT_MARKERS,
  WHY_NPT_TOKENS,
  type WhyNptCard,
} from "@/config/whyNpt";
import { CardImage } from "@/components/media/CardImage";

const DESKTOP_ORBIT_CARDS = WHY_NPT_CARDS.filter((card) =>
  WHY_NPT_DESKTOP_CARD_IDS.includes(card.id),
);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

function useOrbitEllipse() {
  const [ellipse, setEllipse] = React.useState<{ x: number; y: number }>({
    x: WHY_NPT_TOKENS.orbit.radiusXDesktop,
    y: WHY_NPT_TOKENS.orbit.radiusYDesktop,
  });

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) {
        setEllipse({
          x: WHY_NPT_TOKENS.orbit.radiusXDesktop,
          y: WHY_NPT_TOKENS.orbit.radiusYDesktop,
        });
      } else if (w >= 1024) {
        setEllipse({
          x: WHY_NPT_TOKENS.orbit.radiusXLg,
          y: WHY_NPT_TOKENS.orbit.radiusYLg,
        });
      } else {
        setEllipse({
          x: WHY_NPT_TOKENS.orbit.radiusXMd,
          y: WHY_NPT_TOKENS.orbit.radiusYMd,
        });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return ellipse;
}

function WhyCardFace({ card }: { card: WhyNptCard }) {
  const Icon = card.icon;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        "border border-white/24",
        "bg-[linear-gradient(140deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]",
        "shadow-[0_24px_56px_rgba(2,6,23,0.4),inset_0_1px_0_rgba(255,255,255,0.24)]",
        "backdrop-blur-2xl",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 220px at 18% 10%, rgba(220,38,38,0.11), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(520px 240px at 85% 95%, rgba(255,255,255,0.16), transparent 64%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.08em] text-white/62 uppercase">
              {card.eyebrow}
            </div>
            <div
              className="mt-1 text-[13px] leading-snug font-semibold text-white/92"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {card.title}
            </div>
          </div>

          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
              "border border-white/10 bg-white/5",
            )}
            aria-hidden="true"
          >
            <Icon className="h-[16px] w-[16px] text-[color:var(--color-brand-500)]" />
          </span>
        </div>

        <div className="mt-2">
          <div className="text-[16px] font-bold tracking-tight text-white">{card.value}</div>
          <div
            className="mt-1 text-[11px] leading-relaxed text-white/72"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {card.description}
          </div>
        </div>
      </div>
    </div>
  );
}

function SolarSystemBackdrop({
  orbitX,
  orbitY,
  reduceMotion,
}: {
  orbitX: number;
  orbitY: number;
  reduceMotion: boolean;
}) {
  const outerW = orbitX * 2.22;
  const outerH = orbitY * 2.2;
  const middleW = orbitX * 1.78;
  const middleH = orbitY * 1.68;
  const innerW = orbitX * 1.22;
  const innerH = orbitY * 1.18;
  const tilt = WHY_NPT_TOKENS.orbit.tiltDeg;
  const beadAngles = Array.from({ length: 14 }, (_, i) => (Math.PI * 2 * i) / 14);

  return (
    <>
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          width: WHY_NPT_TOKENS.solar.centerRingSize,
          height: WHY_NPT_TOKENS.solar.centerRingSize,
          background: "radial-gradient(circle, rgba(220,38,38,0.5), transparent 68%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { repeat: Infinity, duration: 42, ease: "linear" }}
      >
        <div
          className="absolute top-1/2 left-1/2 rounded-full border border-white/12"
          style={{
            width: outerW,
            height: outerH,
            transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={reduceMotion ? undefined : { repeat: Infinity, duration: 34, ease: "linear" }}
      >
        <div
          className="absolute top-1/2 left-1/2 rounded-full border border-dashed border-white/8"
          style={{
            width: middleW,
            height: middleH,
            transform: `translate(-50%, -50%) rotate(${tilt - 4}deg)`,
          }}
        />
      </motion.div>

      <div
        className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-white/10"
        style={{
          width: innerW,
          height: innerH,
          transform: `translate(-50%, -50%) rotate(${tilt + 6}deg)`,
          boxShadow: "0 0 90px rgba(220,38,38,0.12) inset",
        }}
      />

      {beadAngles.map((angle, idx) => {
        const x = Math.cos(angle) * (outerW / 2);
        const y = Math.sin(angle) * (outerH / 2);
        return (
          <div
            key={idx}
            className="pointer-events-none absolute top-1/2 left-1/2 rounded-full bg-white/70"
            style={{
              width: WHY_NPT_TOKENS.orbit.planetDotSize,
              height: WHY_NPT_TOKENS.orbit.planetDotSize,
              transform: `translate(-50%, -50%) rotate(${tilt}deg) translate(${x}px, ${y}px)`,
              boxShadow: "0 0 18px rgba(255,255,255,0.55)",
              opacity: WHY_NPT_TOKENS.orbit.planetDotOpacity,
            }}
            aria-hidden="true"
          />
        );
      })}

      {WHY_NPT_LOGISTICS_ORBIT_MARKERS.map((marker, idx) => {
        const angle = (marker.angleDeg * Math.PI) / 180;
        const ringX = (middleW / 2) * marker.ringScale;
        const ringY = (middleH / 2) * marker.ringScale;
        const x = Math.cos(angle) * ringX;
        const y = Math.sin(angle) * ringY;
        const Icon = marker.icon;
        const iconSize = WHY_NPT_TOKENS.orbit.logisticsMarkerSize;

        return (
          <span
            key={idx}
            className="pointer-events-none absolute top-1/2 left-1/2 grid place-items-center rounded-full border border-white/18 bg-white/[0.05] backdrop-blur-sm"
            style={{
              width: iconSize + 14,
              height: iconSize + 14,
              transform: `translate(-50%, -50%) rotate(${tilt}deg) translate(${x}px, ${y}px)`,
              opacity: WHY_NPT_TOKENS.orbit.logisticsMarkerOpacity,
            }}
            aria-hidden="true"
          >
            <Icon style={{ width: iconSize, height: iconSize }} className="text-white/92" />
          </span>
        );
      })}
    </>
  );
}

function OrbitCard({
  card,
  baseAngleDeg,
  orbitX,
  orbitY,
  rotation,
}: {
  card: WhyNptCard;
  baseAngleDeg: number;
  orbitX: number;
  orbitY: number;
  rotation: MotionValue<number>;
}) {
  const depth = useTransform(rotation, (deg) => {
    const angleRad = ((deg + baseAngleDeg) * Math.PI) / 180;
    return clamp((Math.sin(angleRad) + 1) / 2, 0, 1);
  });
  const x = useTransform(rotation, (deg) => {
    const angleRad = ((deg + baseAngleDeg) * Math.PI) / 180;
    return Math.cos(angleRad) * orbitX;
  });
  const y = useTransform(rotation, (deg) => {
    const angleRad = ((deg + baseAngleDeg) * Math.PI) / 180;
    return Math.sin(angleRad) * orbitY;
  });
  const scale = useTransform(depth, (d) => {
    return WHY_NPT_TOKENS.orbit.scaleMin + d * (WHY_NPT_TOKENS.orbit.scaleMax - WHY_NPT_TOKENS.orbit.scaleMin);
  });
  const opacity = useTransform(depth, (d) => {
    return WHY_NPT_TOKENS.orbit.cardGlassOpacityMin + d * WHY_NPT_TOKENS.orbit.cardGlassOpacityRange;
  });
  const zIndex = useTransform(depth, (d) => 10 + Math.round(d * 30));

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform-gpu will-change-transform"
      style={{
        width: WHY_NPT_TOKENS.orbit.cardW,
        height: WHY_NPT_TOKENS.orbit.cardH,
        x,
        y,
        scale,
        opacity,
        zIndex,
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <WhyCardFace card={card} />
      </div>
    </motion.div>
  );
}

export function WhyNPTOrbitVisualization() {
  const reduceMotion = useReducedMotion();
  const ellipse = useOrbitEllipse();
  const rotation = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const degPerMs = 360 / (WHY_NPT_TOKENS.orbit.rotationSec * 1000);
    const next = (rotation.get() + delta * degPerMs) % 360;
    rotation.set(next);
  });

  React.useEffect(() => {
    if (reduceMotion) {
      rotation.set(0);
    }
  }, [reduceMotion, rotation]);

  return (
    <div className="relative mx-auto">
      <div
        className="relative mx-auto"
        style={{ height: WHY_NPT_TOKENS.solar.desktopStageHeight, perspective: "1200px" }}
      >
        <SolarSystemBackdrop orbitX={ellipse.x} orbitY={ellipse.y} reduceMotion={Boolean(reduceMotion)} />

        <div className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div
              className="pointer-events-none absolute rounded-full blur-2xl"
              style={{
                width: WHY_NPT_TOKENS.solar.centerCoreSize,
                height: WHY_NPT_TOKENS.solar.centerCoreSize,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, rgba(220,38,38,${WHY_NPT_TOKENS.solar.centerGlowOpacity}), transparent 70%)`,
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute rounded-full opacity-70 blur-3xl"
              style={{
                width: WHY_NPT_TOKENS.solar.centerRingSize,
                height: WHY_NPT_TOKENS.solar.centerRingSize,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 72%)",
              }}
              aria-hidden="true"
            />
            <motion.div
              className="relative"
              style={{
                width: WHY_NPT_TOKENS.solar.coreShellWidth,
                height: WHY_NPT_TOKENS.solar.coreShellHeight,
              }}
              animate={reduceMotion ? undefined : { scale: [1, 1.008, 1] }}
              transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,122,54,0.2), rgba(220,38,38,0.09), transparent 78%)",
                  filter: "blur(8px)",
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute rounded-full blur-xl"
                style={{
                  width: "66%",
                  height: "52%",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-58%, -60%)",
                  background:
                    "radial-gradient(circle, rgba(255,170,110,0.18), rgba(255,78,26,0.04), transparent 72%)",
                }}
                aria-hidden="true"
              />

              <div
                className="absolute inset-0 overflow-hidden rounded-full"
                style={{
                  boxShadow:
                    "inset 0 0 26px rgba(255,255,255,0.1), 0 0 40px rgba(255,74,24,0.24), 0 18px 54px rgba(2,6,23,0.42)",
                }}
              >
                <CardImage
                  src={WHY_NPT_TOKENS.solar.coreImageSrc}
                  alt="NPT"
                  fill
                  sizes={`${WHY_NPT_TOKENS.solar.coreShellWidth}px`}
                  className="object-contain select-none"
                  style={{ transform: `scale(${WHY_NPT_TOKENS.solar.coreImageScale})` }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(145deg, rgba(6,8,16,${WHY_NPT_TOKENS.solar.coreImageDarkenOpacity}), rgba(6,8,16,${WHY_NPT_TOKENS.solar.coreImageDarkenOpacity + 0.08}))`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_50%_50%,rgba(255,185,120,0.08),transparent_62%)]" />
              </div>

              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,153,60,0.14), rgba(255,81,22,0.1), transparent 72%)",
                }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 z-20">
          {DESKTOP_ORBIT_CARDS.map((card, i) => {
            const count = DESKTOP_ORBIT_CARDS.length;
            const baseAngleDeg = i * (360 / count);
            return (
              <OrbitCard
                key={card.id}
                card={card}
                baseAngleDeg={baseAngleDeg}
                orbitX={ellipse.x}
                orbitY={ellipse.y}
                rotation={rotation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
