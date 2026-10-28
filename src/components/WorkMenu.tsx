import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import { WORK_PROJECTS } from "@/config/site";

type WorkMenuProps = {
  href: string;
  label: string;
  isCurrent: boolean;
};

// Enlace "Selected work" del menú + panel flotante (cristal) con los 4 proyectos.
// Se abre con el ratón encima o al llegar con el teclado (Tab); Escape lo cierra.
// En pantallas táctiles no se abre: tocar el enlace lleva a la sección, como siempre.
// Apertura y animaciones en CSS: styles/components/_work-menu.scss
export default function WorkMenu({ href, label, isCurrent }: WorkMenuProps) {
  const { t } = useTranslation();
  const { lang } = useParams();
  const trigger = useRef<HTMLAnchorElement>(null);
  // Cerrado con Escape: se queda cerrado hasta que el ratón o el foco salen del menú.
  const [dismissed, setDismissed] = useState(false);
  // Las miniaturas se cargan la primera vez que se abre el menú, no con la página.
  const [loadThumbs, setLoadThumbs] = useState(false);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    setDismissed(true);
    trigger.current?.focus();
  };

  return (
    <li
      className={`work-menu ${dismissed ? "is-dismissed" : ""}`}
      onPointerEnter={() => setLoadThumbs(true)}
      onPointerLeave={() => setDismissed(false)}
      onFocus={() => setLoadThumbs(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDismissed(false);
      }}
      onKeyDown={onKeyDown}
    >
      <a ref={trigger} href={href} className="site-nav__link" aria-current={isCurrent ? "true" : undefined}>
        {label}
      </a>

      <div className="work-menu__panel">
        <ul className="work-menu__list" aria-label={t("work.listLabel")}>
          {WORK_PROJECTS.map(({ id, slug, frame }, index) => (
            <li key={id} className="work-menu__item" style={{ "--i": index } as CSSProperties}>
              <a href={`/${lang}/work/${slug}`} className="work-menu__link">
                <span className={`work-menu__thumb work-menu__thumb--${frame}`} aria-hidden="true">
                  {loadThumbs && <img src={`/videos/work/${slug}.jpg`} alt="" />}
                </span>
                <span className="work-menu__text">
                  <span className="work-menu__name">{t(`work.items.${id}.name`)}</span>
                  <span className="work-menu__type">{t(`work.frameType.${frame}`)}</span>
                </span>
                <ArrowIcon className="work-menu__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
