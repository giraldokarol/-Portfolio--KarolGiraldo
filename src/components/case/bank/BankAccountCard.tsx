import { useTranslation } from "react-i18next";

type Props = {
  // Clave de los textos de los componentes ficticios (p. ej. "cases.creditMutuelCic.bank").
  textKey: string;
  className?: string;
};

// Tarjeta de cuenta bancaria con datos ficticios. Toma los colores, radios y tipografía del tema
// (clase .bk-theme--… en un contenedor). Estilos: styles/components/_bank-ui.scss
export default function BankAccountCard({ textKey, className = "" }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`bk-account ${className}`}>
      <div className="bk-account__head">
        <div>
          <p className="bk-account__name">{t(`${textKey}.account.name`)}</p>
          <p className="bk-account__number">{t(`${textKey}.account.number`)}</p>
        </div>
        <span className="bk-badge bk-badge--success">{t(`${textKey}.account.status`)}</span>
      </div>
      <div>
        <p className="bk-account__label">{t(`${textKey}.account.balanceLabel`)}</p>
        <p className="bk-account__balance">{t(`${textKey}.account.balance`)}</p>
      </div>
      <div className="bk-account__actions">
        <span className="bk-btn">{t(`${textKey}.account.transfer`)}</span>
        <span className="bk-link">
          {t(`${textKey}.account.details`)} <span aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  );
}
