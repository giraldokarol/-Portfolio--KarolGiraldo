import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import MeshGradient from "./MeshGradient";
import { useContactReveal } from "./contact/useContactReveal";
import { CONTACT_EMAIL, CONTACT_SECTION } from "@/config/site";

const REASONS = ["job", "project", "other"] as const;
type Reason = (typeof REASONS)[number];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// El mensaje crece con el texto (sin barra de scroll dentro del campo).
function fitToContent(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Sección de contacto: título a la izquierda y formulario en una tarjeta de cristal a la derecha,
// sobre el degradado de malla en movimiento (modo relleno).
// Envío: de momento abre el programa de correo con todo escrito (mailto). PENDIENTE: servicio de
// envío directo (ver docs/pendientes.md).
// Estilos: styles/sections/_contact.scss · Entrada animada: contact/useContactReveal.ts
export default function Contact() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const [reason, setReason] = useState<Reason>("job");
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {};
    (["name", "email", "message"] as const).forEach((field) => {
      const error = validate(field, values[field]);
      if (error) found[field] = error;
    });
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((field) => found[field]);
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); // al primer error
      return;
    }

    const subject = t("contact.mailSubject", { reason: t(`contact.reasons.${reason}`) });
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

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
            <input
              type="email"
              autoComplete="email"
              placeholder={t("contact.emailPlaceholder")}
              className="contact__input contact__input--hint"
              {...fieldProps("email")}
            />
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

          <button type="submit" className="btn btn--primary contact__submit">
            {t("contact.send")}
            <ArrowIcon className="btn__icon" />
          </button>

          <p className="contact__status" role="status">
            {opened ? t("contact.opening") : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
