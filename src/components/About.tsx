import { Trans, useTranslation } from "react-i18next";
import { ContactRound, Download } from "lucide-react";

import Portrait from "@/assets/img/portrait_karol.png";
import cvUrl from "@/assets/CV_KarolGiraldo_FR.pdf";
import { LINKEDIN_URL } from "@/config/site";

// <Trans> convierte el <strong> escrito dentro del JSON en negrita real.
const richText = { strong: <strong /> };

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="pb-12 lg:pt-32 bg-white">
      <div className="max-width-page mx-auto px-6 flex flex-col xl:flex-row gap-12 items-center">

        <div className="order-2 w-full lg:order-1 xl:w-1/2 text-center xl:text-left">
          <p className="pretitle">{t("about.pretitle")}</p>

          <h2 className="max-w-5xl mx-auto xl:mx-0 text-5xl font-extrabold tracking-tight text-balance sm:text-7xl mb-2">
            {t("about.title")}
          </h2>

          <img
            src={Portrait}
            alt={t("about.portraitAlt")}
            className="block xl:hidden w-full max-h-[420px] object-contain mb-8 mt-8"
          />

          <div className="mt-5 text-lg text-muted-foreground xl:max-w-2xl mb-8 space-y-6">
            <p>
              <Trans i18nKey="about.paragraph1" components={richText} />
            </p>
            <p>
              <Trans i18nKey="about.paragraph2" components={richText} />
            </p>
          </div>

          <div className="flex gap-4 justify-center xl:justify-start">
            <a href={cvUrl} download className="btn-primary inline-flex items-center gap-2">
              <Download size={18} aria-hidden="true" /> {t("cta.downloadCv")}
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-m font-semibold"
            >
              <ContactRound size={18} aria-hidden="true" /> {t("cta.linkedin")}
            </a>
          </div>
        </div>

        <div className="order-1 w-full lg:order-2 xl:w-1/2 flex justify-center relative">
          {/* Misma imagen que la de móvil: decorativa aquí para no anunciarla dos veces. */}
          <img
            src={Portrait}
            alt=""
            className="w-full max-h-[420px] object-contain xl:max-h-none lg:object-fill hidden xl:block"
          />
        </div>

      </div>
    </section>
  );
}
