import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router";
import { Trans, useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import MeshGradient from "./MeshGradient";
import { useContactReveal } from "./contact/useContactReveal";
import { CONTACT_EMAIL, CONTACT_SECTION } from "@/config/site";
import { hasContactService, sendContactMessage } from "@/lib/contact";

const REASONS = ["job", "project", "other"] as const;
type Reason = (typeof REASONS)[number];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "failed" | "mailto";

const EMPTY = { name: "", email: "", message: "" };

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// El mensaje crece con el texto (sin barra de scroll dentro del campo).
function fitToContent(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Sección de contacto: título a la izquierda y formulario en una tarjeta de cristal a la derecha,
// sobre el degradado de malla en movimiento (modo relleno).
// Envío: directo con Web3Forms (lib/contact.ts). Sin clave configurada, abre el programa de correo
// con todo escrito (mailto).
// Estilos: styles/sections/_contact.scss · Entrada animada: contact/useContactReveal.ts
export default function Contact() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const root = useRef<HTMLElement>(null);
  const [reason, setReason] = useState<Reason>("job");
  const [values, setValues] = useState<Record<Field, string>>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [botcheck, setBotcheck] = useState(false);

  useContactReveal(root);

  const validate = (field: Field, value: string): string | undefined => {
    if (!value.trim()) return t(`contact.errors.${field}`);
    if (field === "email" && !EMAIL_FORMAT.test(value.trim())) return t("contact.errors.emailFormat");
  };

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as Field;
    setValues((current) => ({ ...current, [field]: event.target.value }));
    // Si ya había un error, se corrige mientras escribe (no antes, para no regañar al empezar).
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validate(field, event.target.value) }));
    if (event.target instanceof HTMLTextAreaElement) fitToContent(event.target);
  };

  const onBlur = (field: Field) => {
    if (values[field]) setErrors((current) => ({ ...current, [field]: validate(field, values[field]) }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const found: Errors = {};
    (["name", "email", "message"] as const).forEach((field) => {
      const error = validate(field, values[field]);
      if (error) found[field] = error;
    });
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((field) => found[field]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); // al primer error
      return;
    }

    const subject = t("contact.mailSubject", { reason: t(`contact.reasons.${reason}`) });
    const message = { subject, name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };

    if (!hasContactService) {
      const body = `${message.message}\n\n— ${message.name} (${message.email})`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      await sendContactMessage({ ...message, botcheck });
      setStatus("sent");
      setValues(EMPTY); // formulario limpio para otro mensaje
      form.querySelector<HTMLTextAreaElement>("textarea")?.style.removeProperty("height");
    } catch {
      setStatus("failed");
    }
  };

  const statusText = {
    idle: "",
    sending: t("contact.sending"),
    sent: t("contact.sent"),
    failed: t("contact.failed", { email: CONTACT_EMAIL }),
    mailto: t("contact.opening"),
  }[status];

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange,
    onBlur: () => onBlur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  const error = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="contact__error">
        {errors[field]}
      </p>
    );

  return (
    <section id={CONTACT_SECTION} className="contact" aria-labelledby="contact-title" ref={root}>
      <MeshGradient fill />

      <div className="contact__inner container">
        <header className="contact__intro">
          <h2 id="contact-title" className="contact__title">
            {t("contact.title")}
          </h2>
          <p className="contact__lead">{t("contact.intro")}</p>
        </header>

        <form className="contact__card" onSubmit={onSubmit} noValidate>
          <fieldset className="contact__reasons">
            <legend className="contact__legend">{t("contact.reasonLegend")}</legend>
            <div className="contact__options">
              {REASONS.map((value) => (
                <label key={value} className="contact__option">
                  <input
                    type="radio"
                    name="reason"
                    value={value}
                    checked={reason === value}
                    onChange={() => setReason(value)}
                    className="contact__radio"
                  />
                  {t(`contact.reasons.${value}`)}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Etiqueta "flotante": ocupa el sitio del texto y sube al escribir o al enfocar. */}
          <div className="contact__field">
            <input type="text" autoComplete="name" placeholder=" " className="contact__input" {...fieldProps("name")} />
            <label htmlFor="contact-name" className="contact__label">
              {t("contact.name")}
            </label>
            {error("name")}
          </div>

          <div className="contact__field">
            <input type="email" autoComplete="email" placeholder=" " className="contact__input" {...fieldProps("email")} />
            <label htmlFor="contact-email" className="contact__label">
              {t("contact.email")}
            </label>
            {error("email")}
          </div>

          <div className="contact__field">
            <textarea rows={1} placeholder=" " className="contact__input contact__textarea" {...fieldProps("message")} />
            <label htmlFor="contact-message" className="contact__label">
              {t("contact.message")}
            </label>
            {error("message")}
          </div>

          {/* Aviso RGPD: para qué se usan los datos, con enlace a la política de privacidad. */}
          <p className="contact__privacy">
            {/* La etiqueta se llama <policy> (no <link>: en HTML "link" nunca tiene contenido y el texto saldría fuera). */}
            <Trans i18nKey="contact.privacy" components={{ policy: <a href={`/${lang}/legal#privacy`} /> }} />
          </p>

          {/* Casilla trampa: invisible para las personas; si un robot la marca, el envío se descarta. */}
          <input
            type="checkbox"
            name="botcheck"
            className="contact__trap"
            tabIndex={-1}
            aria-hidden="true"
            checked={botcheck}
            onChange={(event) => setBotcheck(event.target.checked)}
          />

          <button type="submit" className="btn btn--primary contact__submit" disabled={status === "sending"}>
            {status === "sending" ? t("contact.sending") : t("contact.send")}
            <ArrowIcon className="btn__icon" />
          </button>

          <p className={`contact__status contact__status--${status}`} role="status">
            {statusText}
          </p>
        </form>
      </div>
    </section>
  );
}
