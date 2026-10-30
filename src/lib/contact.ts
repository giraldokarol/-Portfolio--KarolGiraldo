// Envío del formulario de contacto con Web3Forms (https://web3forms.com): recibe el mensaje
// y lo reenvía al e-mail de Karol. La web no necesita servidor propio.
// La clave va en .env.local (no se sube a git): VITE_WEB3FORMS_KEY=... (ver .env.example).
// Sin clave, el formulario abre el programa de correo con todo escrito (mailto).
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const hasContactService = Boolean(ACCESS_KEY);

export type ContactMessage = {
  subject: string;
  name: string;
  email: string;
  message: string;
  botcheck: boolean; // casilla trampa invisible: si un robot la marca, Web3Forms descarta el envío
};

export async function sendContactMessage({ subject, name, email, message, botcheck }: ContactMessage) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: ACCESS_KEY, subject, from_name: "Portfolio", name, email, message, botcheck }),
  });
  const result = (await response.json().catch(() => ({}))) as { success?: boolean };
  if (!response.ok || !result.success) throw new Error("Web3Forms: envío rechazado");
}
