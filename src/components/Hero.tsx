import { useTranslation } from "react-i18next";

import ScrollHint from "./ScrollHint";
import HeroImage from "@/assets/img/hero-image.png";
import { SOCIAL_LINKS } from "@/config/site";

// Estado actual del hero, sin animaciones. Se reconstruye en la Fase 3
// siguiendo docs/hero-spec.md.
export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="hero-section min-h-dvh relative overflow-x-hidden">
      <span aria-hidden="true" className="hero-background-text">
        {t("hero.backgroundWord")}
      </span>

      <div className="absolute left-12 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 hidden lg:block">
        <ul className="flex items-center gap-12 whitespace-nowrap">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors link-functions uppercase text-sm" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section className="mx-auto flex min-h-dvh w-full flex-col px-6 pt-(--header-h)" id="home">
        <div className="flex flex-1 flex-col items-center justify-center">
          <img src={HeroImage} alt={t("hero.stickerAlt")} className="w-3xs mb-4" />

          <h1 className="max-w-5xl text-5xl leading-[1.02] font-extrabold tracking-tight text-balance sm:text-7xl lg:text-8xl text-center z-1">
            {t("hero.greeting")} <span className="text-primary">{t("hero.role")}</span>
          </h1>

          <p className="mt-8 text-xl text-center max-w-2xl z-1">{t("hero.subtitle")}</p>
        </div>

        <div className="mb-8 hidden justify-center lg:flex">
          <a href="#projects" aria-label={t("a11y.scrollToProjects")}>
            <ScrollHint />
          </a>
        </div>
      </section>
    </div>
  );
}
