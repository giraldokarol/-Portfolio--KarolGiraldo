import { useTranslation } from "react-i18next";

import BankAccountCard from "./BankAccountCard";

type Props = { textKey: string };

// Tarjeta "Built to be reused": arriba un componente (tarjeta de cuenta, Theme 1) y debajo tres mini
// páginas en esqueleto; unas líneas lo llevan a cada una, donde aparece el mismo componente en pequeño.
// Decorativo. Estilos: styles/sections/_case-bank-visuals.scss
export default function BankReuse({ textKey }: Props) {
  const { t } = useTranslation();
  const pages = t(`${textKey}.pages`, { returnObjects: true }) as string[];

  return (
    <div className="bank-visual bank-reuse bk-theme bk-theme--alpha">
      {/* Líneas del componente a cada página (coordenadas en % de la caja), detrás de la tarjeta. */}
      <svg className="bank-reuse__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M50 50 V61 H18 V67" />
        <path d="M50 50 V67" />
        <path d="M50 61 H82 V67" />
      </svg>

      <BankAccountCard textKey={textKey} className="bank-reuse__source" />

      <div className="bank-reuse__pages">
        {pages.map((page) => (
          <div key={page} className="bank-reuse__page">
            <span className="bank-reuse__page-label">{page}</span>
            <span className="bank-reuse__bar bank-reuse__bar--title" />
            <BankAccountCard textKey={textKey} className="bank-reuse__mini" />
            <span className="bank-reuse__bar" />
            <span className="bank-reuse__bar bank-reuse__bar--short" />
          </div>
        ))}
      </div>
    </div>
  );
}
