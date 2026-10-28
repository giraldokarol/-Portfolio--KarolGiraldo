import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import Logo from "./Logo";
import ArrowRightCircle from "@/assets/icons/arrow-right-circle.svg";
import MailIcon from "@/assets/icons/mail.svg";
import { CONTACT_SECTION, NAV_LINKS, type NavSection } from "@/config/site";

// Menú principal (Figma: "Principal Menu"). Estilos: styles/components/_header.scss
export default function Header() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Marca en el menú la sección que está en el centro de la pantalla.
  useEffect(() => {
    const sections = NAV_LINKS.map(({ section }) => document.getElementById(section)).filter(
      (section): section is HTMLElement => section !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id as NavSection);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <nav className="site-nav" aria-label={t("a11y.mainNav")}>
        <a href={`/${lang}`} aria-label={t("a11y.homeLink")}>
          <Logo />
        </a>

        <div className="site-nav__actions">
          <ul className="site-nav__links">
            {NAV_LINKS.map(({ section, label }) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="site-nav__link"
                  aria-current={activeSection === section ? "true" : undefined}
                >
                  {t(`nav.${label}`)}
                </a>
              </li>
            ))}
          </ul>

          {/* En móvil solo se ve el icono de correo; el texto sigue ahí para lectores de pantalla. */}
          <a href={`#${CONTACT_SECTION}`} className="btn btn--hello">
            <span className="btn--hello__label">{t("cta.sayHello")}</span>
            <img src={ArrowRightCircle} alt="" width={24} height={24} className="btn__icon btn--hello__arrow" />
            <img src={MailIcon} alt="" width={24} height={24} className="btn--hello__mail" />
          </a>
        </div>
      </nav>
    </header>
  );
}
