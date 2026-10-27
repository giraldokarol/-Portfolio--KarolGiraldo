import { useTranslation } from "react-i18next";

import Cards from "./Cards";
import CoverWebApp from "@/assets/img/cover-web-app.png";
import CoverDriverApp from "@/assets/img/cover-app-driver.png";
import CoverCMCIC from "@/assets/img/cover-cmcic.png";
import CoverTuLindero from "@/assets/img/cover-tulindero.png";

// Orden y maquetación de las tarjetas; los textos están en locales/*/common.json → projects.items.
const PROJECTS = [
  { id: "fleetWeb", image: CoverWebApp, href: "#", span: "md:col-span-7" },
  { id: "driverApp", image: CoverDriverApp, href: "#", span: "md:col-span-5" },
  { id: "cmcic", image: CoverCMCIC, href: "#", span: "md:col-span-5" },
  { id: "tulindero", image: CoverTuLindero, href: "#", span: "md:col-span-7" },
] as const;

export default function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="pb-12 lg:pt-24 bg-white">
      <div className="max-width-page mx-auto px-6 text-center xl:text-left">
        <p className="pretitle">{t("projects.pretitle")}</p>

        <h2 className="max-w-5xl mx-auto xl:mx-0 text-5xl font-extrabold tracking-tight text-balance sm:text-7xl mb-2">
          {t("projects.title")}
        </h2>

        <p className="mt-5 text-lg text-muted-foreground xl:max-w-2xl">{t("projects.intro")}</p>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-10 max-width-page mx-auto px-6">
        {PROJECTS.map(({ id, image, href, span }) => (
          <article key={id} className={`col-span-12 ${span} card`}>
            <Cards
              href={href}
              title={t(`projects.items.${id}.title`)}
              categories={t(`projects.items.${id}.categories`, { returnObjects: true }) as string[]}
              description={t(`projects.items.${id}.description`)}
              image={image}
              imageAlt={t(`projects.items.${id}.imageAlt`)}
              readMoreLabel={t("projects.readMore")}
              readMoreAriaLabel={t("projects.readMoreAbout", { title: t(`projects.items.${id}.title`) })}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
