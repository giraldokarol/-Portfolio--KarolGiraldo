import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import Logo from "./Logo";
import WorkMenu from "./WorkMenu";
import MailIcon from "@/assets/icons/mail.svg";
import { CONTACT_SECTION, HERO_SECTION, NAV_LINKS, type NavSection } from "@/config/site";

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
  // También vigila el hero (#home): al volver arriba no hay ninguna sección del menú activa.
  useEffect(() => {
    const sections = [HERO_SECTION, ...NAV_LINKS.map(({ section }) => section)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setActiveSection(id === HERO_SECTION ? null : (id as NavSection));
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // La URL acompaña al scroll: /es#projects en una sección, /es (sin #) de vuelta en el hero.
  // replaceState cambia la URL sin recargar, sin mover el scroll y sin añadir pasos al botón "atrás".
  useEffect(() => {
    const hash = activeSection ? `#${activeSection}` : "";
    if (window.location.hash === hash) return;
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    window.history.replaceState(window.history.state, "", url); // conserva el estado de React Router
  }, [activeSection]);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <nav className="site-nav" aria-label={t("a11y.mainNav")}>
        <a href={`/${lang}`} aria-label={t("a11y.homeLink")}>
          <Logo />
        </a>

        <div className="site-nav__actions">
          <ul className="site-nav__links">
            {/* Enlaces con /idioma delante: funcionan también desde otras páginas (p. ej. la legal). */}
            {NAV_LINKS.map(({ section, label }) =>
              // "Selected work" abre además un menú con los proyectos (WorkMenu).
              section === "projects" ? (
                <WorkMenu
                  key={section}
                  href={`/${lang}#${section}`}
                  label={t(`nav.${label}`)}
                  isCurrent={activeSection === section}
                />
              ) : (
                <li key={section}>
                  <a
                    href={`/${lang}#${section}`}
                    className="site-nav__link"
                    aria-current={activeSection === section ? "true" : undefined}
                  >
                    {t(`nav.${label}`)}
                  </a>
                </li>
              ),
            )}
          </ul>

          {/* En móvil solo se ve el icono de correo; el texto sigue ahí para lectores de pantalla. */}
          <a href={`/${lang}#${CONTACT_SECTION}`} className="btn btn--hello">
            <span className="btn--hello__label">{t("cta.sayHello")}</span>
            <ArrowIcon className="btn__icon btn--hello__arrow" />
            <img src={MailIcon} alt="" width={24} height={24} className="btn--hello__mail" />
          </a>
        </div>
      </nav>
    </header>
  );
}
