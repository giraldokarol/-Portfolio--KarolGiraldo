import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import BankAccountCard from "./BankAccountCard";

type Props = { textKey: string };

const THEMES = ["default", "alpha", "beta"] as const;
// Tiempo que se queda cada tema antes de pasar al siguiente.
const INTERVAL = 2600;

// Tarjeta "foto" de Final Thoughts (caso Crédit Mutuel & CIC): una pantalla de banca ficticia que va
// cambiando sola de tema (Default → Banque Alpha → Banque Beta). Los componentes son los mismos; solo
// cambian los valores de las variables. Con reduced-motion se queda quieta en Banque Alpha.
// Decorativa: la tarjeta la describe con su texto alternativo. Estilos: styles/sections/_case-bank-visuals.scss
export default function BankShowcase({ textKey }: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % THEMES.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  const theme = THEMES[index];

  return (
    <div className={`bank-showcase bk-theme bk-theme--${theme}`}>
      <div className="bank-showcase__switch">
        {THEMES.map((name) => (
          <span key={name} className={name === theme ? "is-current" : undefined}>
            {t(`${textKey}.themes.${name}`)}
          </span>
        ))}
      </div>

      <p className="bank-showcase__title">{t(`${textKey}.pages.0`)}</p>
      <BankAccountCard textKey={textKey} />

      <div className="bk-field">
        <span className="bk-field__label">{t(`${textKey}.amountLabel`)}</span>
        <span className="bk-field__input bank-visual__input">{t(`${textKey}.amountValueOk`)}</span>
      </div>
      <span className="bk-btn">{t(`${textKey}.send`)}</span>

      <span className="bk-choice is-checked">
        <span className="bk-toggle" />
        {t(`${textKey}.toggle`)}
      </span>
    </div>
  );
}
