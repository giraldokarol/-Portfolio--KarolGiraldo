import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

// Piezas de los visuales de "Challenge" (caso Crédit Mutuel & CIC), hechas con los componentes ficticios.
// Cada una es una pieza de la composición de CaseResearch (se animan una tras otra). Decorativas: la
// composición entera se describe con su texto alternativo. Estilos: styles/sections/_case-bank-visuals.scss

type Props = { textKey: string };

// ─── 01 · Muchas páginas ─────────────────────────────────────────────────────────────

// Abanico de páginas en esqueleto que se alejan y se desvanecen hacia atrás.
export function BankPagesFan() {
  return (
    <div className="bank-fan">
      {[4, 3, 2, 1, 0].map((depth) => (
        <div key={depth} className="bank-fan__page" style={{ "--depth": depth } as CSSProperties}>
          <span className="bank-fan__bar bank-fan__bar--head" />
          <span className="bank-fan__bar bank-fan__bar--title" />
          <span className="bank-fan__block" />
          <span className="bank-fan__bar" />
          <span className="bank-fan__bar bank-fan__bar--short" />
          <span className="bank-fan__block bank-fan__block--low" />
        </div>
      ))}
    </div>
  );
}

// Iconos de línea de los botones de fondo (24 × 24).
const ICONS = {
  home: "M4 11 12 4l8 7M6 9.5V20h12V9.5",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4h4",
  card: "M3 7h18v11H3zM3 11h18M7 15h4",
  chat: "M4 5h16v11H9l-5 4V5Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1-4 4-6 7-6s6 2 7 6",
} as const;

// Botones de iconos repartidos por el fondo, suaves (posición en % de la caja; big = un poco más grande).
const BACKGROUND_ICONS: { icon: keyof typeof ICONS; x: number; y: number; big?: boolean }[] = [
  { icon: "card", x: 5, y: 36 },
  { icon: "home", x: 13, y: 50, big: true },
  { icon: "bell", x: 90, y: 42 },
  { icon: "user", x: 60, y: 97 },
];

export function BankIconField() {
  return (
    <div className="bank-icons">
      {BACKGROUND_ICONS.map(({ icon, x, y, big }) => (
        <span
          key={icon}
          className={`bank-icons__button ${big ? "bank-icons__button--big" : ""}`}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <svg viewBox="0 0 24 24">
            <path d={ICONS[icon]} />
          </svg>
        </span>
      ))}
    </div>
  );
}

// Notificación: mensaje nuevo del asesor (Theme 1, Banque Alpha).
export function BankAdvisorMessage({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-message bk-theme bk-theme--alpha">
      <span className="bank-message__avatar">
        <svg viewBox="0 0 24 24">
          <path d={ICONS.chat} />
        </svg>
      </span>
      <div className="bank-message__body">
        <div className="bank-message__head">
          <span className="bank-message__from">{t(`${textKey}.challenge.message.from`)}</span>
          <span className="bank-message__time">{t(`${textKey}.challenge.message.time`)}</span>
        </div>
        <p className="bank-message__text">{t(`${textKey}.challenge.message.text`)}</p>
      </div>
      <span className="bank-message__dot" />
    </div>
  );
}

// Línea de una cuenta bancaria, como en la lista de cuentas (Theme 1, Banque Alpha).
export function BankAccountRow({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-row bk-theme bk-theme--alpha">
      <span className="bank-row__icon">
        <svg viewBox="0 0 24 24">
          <path d={ICONS.card} />
        </svg>
      </span>
      <div className="bank-row__name">
        <span>{t(`${textKey}.account.name`)}</span>
        <span className="bank-row__number">{t(`${textKey}.account.number`)}</span>
      </div>
      <span className="bank-row__balance">{t(`${textKey}.account.balance`)}</span>
    </div>
  );
}

// ─── 02 · Una base, dos marcas ───────────────────────────────────────────────────────

// El mismo campo + botón, con el tema que se le pase: neutro (base) o una de las dos marcas.
export function BankThemedPair({ textKey, theme }: Props & { theme: "default" | "alpha" | "beta" }) {
  const { t } = useTranslation();

  return (
    <div className={`bank-pair bk-theme bk-theme--${theme}`}>
      <span className="bank-pair__name">{t(`${textKey}.themes.${theme}`)}</span>
      <div className="bk-field">
        <span className="bk-field__label">{t(`${textKey}.amountLabel`)}</span>
        <span className="bk-field__input bank-visual__input">{t(`${textKey}.amountValueOk`)}</span>
      </div>
      <span className="bk-btn">{t(`${textKey}.send`)}</span>
    </div>
  );
}

// Líneas finas de la base neutra (arriba, en el centro) a cada marca (debajo, a cada lado).
// Coordenadas en % de la caja.
export function BankThemeLines() {
  return (
    <svg className="bank-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M50 37 C50 43 22 43 22 48" />
      <path d="M50 37 C50 43 78 43 78 48" />
    </svg>
  );
}

// ─── 03 · Sobrescrituras por todas partes ────────────────────────────────────────────

// Código Less ficticio (no es el de la empresa) y en inglés en todos los idiomas, como en un editor real.
// Una regla de la identidad anterior, sobrescrita por la de una página: lo antiguo queda tachado y lo nuevo
// solo gana a base de !important. "@…" = variables de Less.
export type CodeLine = { text: string; kind?: "comment" | "selector" | "overridden" | "forced" };

const LESS: CodeLine[] = [
  { text: "// legacy/buttons.less", kind: "comment" },
  { text: ".btn {", kind: "selector" },
  { text: "  .button-base();" },
  { text: "  background: @grey-legacy;", kind: "overridden" },
  { text: "  border-radius: 2px;", kind: "overridden" },
  { text: "}" },
  { text: "// pages/accounts.less", kind: "comment" },
  { text: ".page-accounts .btn {", kind: "selector" },
  { text: "  background: @blue-new !important;", kind: "forced" },
  { text: "  border-radius: @radius-pill !important;", kind: "forced" },
  { text: "}" },
];

// Ventana de editor oscura con código (número de línea + código). La primera pestaña es la activa.
export function BankCodeWindow({ tabs, lines }: { tabs: string[]; lines: CodeLine[] }) {
  return (
    <div className="bank-devtools">
      <div className="bank-devtools__tabs">
        <span className="bank-devtools__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {tabs.map((tab, index) => (
          <span key={tab} className={index === 0 ? "is-current" : undefined}>
            {tab}
          </span>
        ))}
      </div>
      <ol className="bank-devtools__code">
        {lines.map((line, index) => (
          <li key={index} className={line.kind ? `is-${line.kind}` : undefined}>
            <span className="bank-devtools__prop">{line.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Challenge 03: la regla antigua sobrescrita por la de una página.
export function BankDevTools() {
  return <BankCodeWindow tabs={["accounts.less", "buttons.less"]} lines={LESS} />;
}

// Aviso flotante: "12 overrides on .btn".
export function BankOverridesAlert({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-alert-card">
      <svg className="bank-alert-card__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 10v4M12 17v.5" />
      </svg>
      <span>{t(`${textKey}.challenge.alert`)}</span>
    </div>
  );
}
