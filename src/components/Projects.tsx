import { useTranslation } from "react-i18next";

import Cards from "./Cards";
import CoverWebApp from "@/assets/img/cover-web-app.png";
import CoverDriverApp from "@/assets/img/cover-app-driver.png";
import CoverCMCIC from "@/assets/img/cover-cmcic.png";
import CoverTuLindero from "@/assets/img/cover-tulindero.png";

// Orden y maquetación de las tarjetas; los textos están en locales/*/common.json → projects.items.
// Estilos: styles/sections/_projects.scss
const PROJECTS = [
  { id: "fleetWeb", image: CoverWebApp, href: "#", size: "wide" },
  { id: "driverApp", image: CoverDriverApp, href: "#", size: "narrow" },
  { id: "cmcic", image: CoverCMCIC, href: "#", size: "narrow" },
  { id: "tulindero", image: CoverTuLindero, href: "#", size: "wide" },
] as const;

export default function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="projects">
      <div className="projects__header container">
        <p className="pretitle">{t("projects.pretitle")}</p>
        <h2 className="section-title">{t("projects.title")}</h2>
        <p className="section-intro">{t("projects.intro")}</p>
      </div>

      <div className="projects__grid container">
        {PROJECTS.map(({ id, image, href, size }) => (
          <article key={id} className={`projects__item projects__item--${size}`}>
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
