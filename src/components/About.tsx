import { Trans, useTranslation } from "react-i18next";
import { ContactRound, Download } from "lucide-react";

import Portrait from "@/assets/img/portrait_karol.png";
import cvUrl from "@/assets/CV_KarolGiraldo_FR.pdf";
import { LINKEDIN_URL } from "@/config/site";

// <Trans> convierte el <strong> escrito dentro del JSON en negrita real.
const richText = { strong: <strong /> };

// Estilos: styles/sections/_about.scss
export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="about">
      <div className="about__inner container">

        <div className="about__text">
          <p className="pretitle">{t("about.pretitle")}</p>
          <h2 className="section-title">{t("about.title")}</h2>

          <img src={Portrait} alt={t("about.portraitAlt")} className="about__portrait about__portrait--inline" />

          <div className="about__body section-intro">
            <p>
              <Trans i18nKey="about.paragraph1" components={richText} />
            </p>
            <p>
              <Trans i18nKey="about.paragraph2" components={richText} />
            </p>
          </div>

          <div className="about__actions">
            <a href={cvUrl} download className="btn btn--primary">
              <Download size={18} aria-hidden="true" /> {t("cta.downloadCv")}
            </a>

            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn btn--secondary">
              <ContactRound size={18} aria-hidden="true" /> {t("cta.linkedin")}
            </a>
          </div>
        </div>

        <div className="about__media">
          {/* Misma imagen que la de móvil: decorativa aquí para no anunciarla dos veces. */}
          <img src={Portrait} alt="" className="about__portrait about__portrait--side" />
        </div>

      </div>
    </section>
  );
}
