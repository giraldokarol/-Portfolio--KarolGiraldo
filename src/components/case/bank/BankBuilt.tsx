import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { BankCodeWindow, type CodeLine } from "./BankChallenge";

// Visuales de las tarjetas de "What I built" (caso Crédit Mutuel & CIC), hechos con los componentes
// ficticios. Cada uno tiene la proporción de las capturas (760 × 510) y escala como una imagen.
// Decorativos: la tarjeta los describe con su texto alternativo. Estilos: styles/sections/_case-bank-visuals.scss

type Props = { textKey: string };

const THEMES = ["default", "alpha", "beta"] as const;

// ─── 01 · Componentes derivados del nuevo diseño público ─────────────────────────────
// A la izquierda, la maqueta de la web pública (Banque Alpha); a la derecha, lo que se deriva de ella:
// colores, forma y tipografía, y el componente resultante.
export function BankDerived({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-visual bank-visual--bare bank-derived bk-theme bk-theme--alpha">
      <div className="bank-derived__site">
        <span className="bank-derived__caption">{t(`${textKey}.built.site`)}</span>
        <div className="bank-derived__browser">
          <span className="bank-derived__dots">
            <span />
            <span />
            <span />
          </span>
          <div className="bank-derived__hero">
            <span className="bank-derived__line bank-derived__line--title" />
            <span className="bank-derived__line" />
            <span className="bank-derived__pill" />
          </div>
          <div className="bank-derived__tiles">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <svg className="bank-derived__arrow" viewBox="0 0 40 12" aria-hidden="true">
        <path d="M1 6h36m-5-4 5 4-5 4" />
      </svg>

      <div className="bank-derived__tokens">
        <span className="bank-derived__caption">{t(`${textKey}.built.tokens`)}</span>
        <div className="bank-derived__swatches">
          <span style={{ background: "var(--bk-primary)" }} />
          <span style={{ background: "var(--bk-primary-hover)" }} />
          <span style={{ background: "var(--bk-surface-alt)" }} />
          <span style={{ background: "var(--bk-border)" }} />
        </div>
        <div className="bank-derived__specs">
          <span className="bank-derived__shape" />
          <span className="bank-derived__type">Aa</span>
        </div>
        <span className="bk-btn">{t(`${textKey}.primary`)}</span>
      </div>
    </div>
  );
}

// ─── 02 · Un tema neutro por defecto ─────────────────────────────────────────────────
// Tabla de variables: cada fila es una propiedad y cada columna un tema. Las celdas leen el valor del
// tema de su columna: es literalmente el mismo componente con otros valores.
export function BankTokens({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-visual bank-visual--bare bank-tokens">
      <div className="bank-tokens__table">
        <span className="bank-tokens__head">{t(`${textKey}.built.variable`)}</span>
        {THEMES.map((theme) => (
          <span key={theme} className="bank-tokens__head">
            {t(`${textKey}.themes.${theme}`)}
          </span>
        ))}

        <code className="bank-tokens__var">@primary</code>
        {THEMES.map((theme) => (
          <span key={theme} className={`bank-tokens__cell bk-theme bk-theme--${theme}`}>
            <span className="bank-tokens__swatch" />
          </span>
        ))}

        <code className="bank-tokens__var">@radius</code>
        {THEMES.map((theme) => (
          <span key={theme} className={`bank-tokens__cell bk-theme bk-theme--${theme}`}>
            <span className="bank-tokens__radius" />
          </span>
        ))}

        <code className="bank-tokens__var">@font-figures</code>
        {THEMES.map((theme) => (
          <span key={theme} className={`bank-tokens__cell bk-theme bk-theme--${theme}`}>
            <span className="bank-tokens__font">1,280</span>
          </span>
        ))}

        <code className="bank-tokens__var">.btn</code>
        {THEMES.map((theme) => (
          <span key={theme} className={`bank-tokens__cell bk-theme bk-theme--${theme}`}>
            <span className="bk-btn">{t(`${textKey}.send`)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 03 · CSS más simple con mixins ──────────────────────────────────────────────────
// Código Less ficticio (no es el de la empresa): un mixin escrito una vez y usado por dos botones.
const MIXIN: CodeLine[] = [
  { text: "// mixins/buttons.less", kind: "comment" },
  { text: ".button-base(@bg; @color) {", kind: "selector" },
  { text: "  padding: @space-s @space-m;" },
  { text: "  border-radius: @radius;" },
  { text: "  background: @bg;" },
  { text: "  color: @color;" },
  { text: "}" },
  { text: ".btn-primary {", kind: "selector" },
  { text: "  .button-base(@primary; @on-primary);" },
  { text: "}" },
  { text: ".btn-secondary {", kind: "selector" },
  { text: "  .button-base(@surface; @primary);" },
  { text: "}" },
];

export function BankMixins({ textKey }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bank-visual bank-visual--bare bank-mixins">
      <div className="bank-mixins__code">
        <BankCodeWindow tabs={["buttons.less", "variables.less"]} lines={MIXIN} />
      </div>
      <div className="bank-mixins__result bk-theme bk-theme--alpha">
        <code>.btn-primary</code>
        <span className="bk-btn">{t(`${textKey}.primary`)}</span>
        <code>.btn-secondary</code>
        <span className="bk-btn bk-btn--secondary">{t(`${textKey}.secondary`)}</span>
      </div>
    </div>
  );
}

// ─── 04 · Probado con cada servicio ──────────────────────────────────────────────────
// Lista de servicios que usan el framework con su estado de validación, y las tres etapas de cada cambio.
export function BankServices({ textKey }: Props) {
  const { t } = useTranslation();
  const services = t(`${textKey}.built.services`, { returnObjects: true }) as string[];
  const steps = t(`${textKey}.built.steps`, { returnObjects: true }) as string[];
  const done = services.length - 1; // el último, aún en revisión

  return (
    <div className="bank-visual bank-visual--bare bank-services bk-theme">
      <div className="bank-services__card">
        <div className="bank-services__head">
          <span className="bank-services__title">{t(`${textKey}.built.release`)}</span>
          <span className="bank-services__count">
            {done}/{services.length}
          </span>
        </div>
        <span className="bank-services__progress" style={{ "--done": done / services.length } as CSSProperties} />
        <ul className="bank-services__list">
          {services.map((service, index) => (
            <li key={service}>
              <span>{service}</span>
              {index < done ? (
                <span className="bk-badge bk-badge--success">{t(`${textKey}.built.validated`)}</span>
              ) : (
                <span className="bk-badge bank-services__review">{t(`${textKey}.built.review`)}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ol className="bank-services__steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
