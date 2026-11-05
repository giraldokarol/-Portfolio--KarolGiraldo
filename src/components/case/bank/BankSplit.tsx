import { useTranslation } from "react-i18next";

type Props = { textKey: string };

// Tarjeta "One framework, two brands": el mismo campo + botón, mitad con el Theme 1 (Banque Alpha) y
// mitad con el Theme 2 (Banque Beta). Las dos capas son idénticas salvo la clase del tema; la de Beta se
// recorta desde la línea divisoria, que va y viene despacio (CSS; con reduced-motion, quieta en el centro).
// Decorativo. Estilos: styles/sections/_case-bank-visuals.scss
export default function BankSplit({ textKey }: Props) {
  const { t } = useTranslation();

  const pair = (
    <div className="bank-split__pair">
      <div className="bk-field">
        <span className="bk-field__label">{t(`${textKey}.amountLabel`)}</span>
        <span className="bk-field__input bank-visual__input">{t(`${textKey}.amountValueOk`)}</span>
      </div>
      <span className="bk-btn">{t(`${textKey}.send`)}</span>
    </div>
  );

  return (
    <div className="bank-visual bank-split">
      <div className="bank-split__layer bk-theme bk-theme--alpha">
        <span className="bank-split__brand">{t(`${textKey}.themes.alpha`)}</span>
        {pair}
      </div>
      <div className="bank-split__layer bank-split__layer--beta bk-theme bk-theme--beta">
        <span className="bank-split__brand bank-split__brand--end">{t(`${textKey}.themes.beta`)}</span>
        {pair}
      </div>
      <span className="bank-split__line" />
    </div>
  );
}
