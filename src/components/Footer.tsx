import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

import LogoFooter from "@/assets/img/logo-footer.png";
import { CONTACT_EMAIL, CONTACT_SECTION, SOCIAL_LINKS } from "@/config/site";

// PENDIENTE: selector de idioma "EN · FR · ES" (ver docs/pendientes.md).
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer id={CONTACT_SECTION} className="bg-white">
      <div className="max-width-page mx-auto footer pt-16 pb-16 px-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10">

        <div className="flex lg:min-w-[200px] justify-center">
          <img src={LogoFooter} alt={t("footer.logoAlt")} className="w-[70px] lg:w-[90px]" />
        </div>

        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-10 md:gap-16 lg:contents">

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-bold tracking-tight text-4xl lg:text-5xl text-primary mb-2">{t("footer.title")}</p>

            <p className="info">{t("footer.text")}</p>

            <p className="flex items-center gap-2 info">
              <Mail size={18} aria-hidden="true" />
              <span>{CONTACT_EMAIL}</span>
            </p>
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-xl font-bold tracking-tight mb-2 text-primary">{t("footer.socialTitle")}</p>

            <ul className="flex flex-col gap-1">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-functions" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}
