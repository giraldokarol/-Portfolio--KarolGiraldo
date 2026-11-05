import { useTranslation } from "react-i18next";

type Props = { textKey: string };

// Tarjeta "20+ components redesigned": tres componentes enteros con el Theme 1 (Banque Alpha), centrados:
// un campo con foco, los botones principal y secundario, y una casilla marcada.
// Decorativo (la tarjeta lo describe con su texto alternativo). Estilos: styles/sections/_case-bank-visuals.scss
export default function BankMosaic({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-visual bank-mosaic bk-theme bk-theme--alpha">
      <div className="bank-mosaic__stack">
        <div className="bk-field is-focus">
          <span className="bk-field__label">{t(`${textKey}.inputLabel`)}</span>
          <span className="bk-field__input bank-visual__input">{t(`${textKey}.inputValue`)}</span>
          <span className="bk-field__helper">{t(`${textKey}.helper`)}</span>
        </div>
        <div className="bank-mosaic__row">
          <span className="bk-btn">{t(`${textKey}.primary`)}</span>
          <span className="bk-btn bk-btn--secondary">{t(`${textKey}.secondary`)}</span>
        </div>
        <span className="bk-choice is-checked">
          <span className="bk-choice__box" />
          {t(`${textKey}.checkbox`)}
        </span>
      </div>
    </div>
  );
}
