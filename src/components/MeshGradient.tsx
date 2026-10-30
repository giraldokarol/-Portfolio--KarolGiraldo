import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

// Degradado de malla animado (mesh gradient) dibujado con WebGL: dentro de unos círculos
// o, con fill, ocupando todo el fondo (aparece suavemente de arriba abajo).
// Un "shader" es un pequeño programa que la tarjeta gráfica ejecuta para cada píxel a la vez:
// por eso puede animar un degradado complejo a 60 fps sin cargar el procesador.
// Estilos: styles/components/_mesh-gradient.scss

// Círculo: centro (x, y) y radio r, en fracción del ancho/alto del contenedor (0–1).
export type MeshCircle = { x: number; y: number; r: number };

type MeshGradientProps = {
  // Hasta 3 círculos (el shader tiene 3 huecos; los que falten no se dibujan).
  circles?: MeshCircle[];
  // Todo el fondo en vez de círculos: amarillo a la izquierda, azul a la derecha, blanco arriba.
  fill?: boolean;
  // Distribución opcional para pantallas pequeñas (< 1024 px).
  mobileCircles?: MeshCircle[];
  className?: string;
  // Cuánto color lleva cada pastel sobre blanco (0–1); no cambia la opacidad. Las manchas del Hero = 0.2.
  intensity?: number;
  // Opacidad de los círculos (0–1): cuánto se funden con el fondo.
  opacity?: number;
};

// Lista vacía fija: un [] por defecto sería una lista nueva en cada render y reiniciaría el efecto.
const NO_CIRCLES: MeshCircle[] = [];

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Para cada píxel: ¿está dentro de algún círculo? Si sí, mezcla los tres colores de marca
// según su distancia a tres puntos que se mueven despacio, con una ligera ondulación.
const FRAGMENT = `
precision mediump float;
uniform vec2 u_size;
uniform float u_time;
uniform vec3 u_circles[3];
uniform vec3 u_colors[3];
uniform float u_intensity;
uniform float u_opacity;
uniform float u_fill;

void main() {
  vec2 px = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  vec2 st = px / u_size;

  // Relleno: todo el fondo, que aparece suavemente desde arriba (ya hay color detrás de la tarjeta).
  float mask = u_fill * smoothstep(0.0, 0.55, st.y);
  for (int i = 0; i < 3; i++) {
    vec2 c = u_circles[i].xy * u_size;
    float r = u_circles[i].z * u_size.x;
    if (r <= 0.0) continue; // hueco vacío (menos de 3 círculos)
    float d = distance(px, c);
    mask = max(mask, 1.0 - smoothstep(r * 0.92, r, d));
  }
  if (mask <= 0.0) { gl_FragColor = vec4(0.0); return; }

  // Coordenadas 0–1 en ambos ejes; los tres puntos de color orbitan alrededor de los círculos
  // (amarillo arriba a la izquierda, azul abajo a la derecha, blanco en medio) para que cada
  // círculo mezcle los tres, como en el diseño.
  float t = u_time * 0.8; // velocidad del movimiento
  vec2 q = st + 0.06 * vec2(sin(st.y * 9.0 + t * 1.7), cos(st.x * 7.0 - t * 1.3));
  vec2 p0 = vec2(0.27 + 0.13 * sin(t * 0.9), 0.32 + 0.16 * cos(t * 0.7));
  vec2 p1 = vec2(0.40 + 0.12 * cos(t * 0.8), 0.62 + 0.18 * sin(t * 1.1));
  vec2 p2 = vec2(0.32 + 0.14 * sin(t * 0.6 + 2.0), 0.50 + 0.20 * cos(t * 0.9 + 1.0));
  // Relleno: los puntos recorren todo el ancho (amarillo izquierda, azul derecha, blanco arriba).
  p0 = mix(p0, vec2(0.18 + 0.12 * sin(t * 0.7), 0.78 + 0.12 * cos(t * 0.6)), u_fill);
  p1 = mix(p1, vec2(0.82 + 0.12 * cos(t * 0.6), 0.82 + 0.12 * sin(t * 0.8)), u_fill);
  p2 = mix(p2, vec2(0.50 + 0.25 * sin(t * 0.5 + 2.0), 0.40 + 0.10 * cos(t * 0.7 + 1.0)), u_fill);
  // Exponente 3: transiciones más cortas, cada color se ve más puro.
  float w0 = 1.0 / (0.002 + pow(distance(q, p0), 3.0));
  float w1 = 1.0 / (0.002 + pow(distance(q, p1), 3.0));
  float w2 = 1.0 / (0.003 + pow(distance(q, p2), 3.0));
  // Cada color se pasa primero a su versión pastel sobre blanco (como las manchas del Hero) y
  // después se mezclan. Mezclar amarillo y azul puros da gris; mezclar sus pasteles, un tono limpio.
  vec3 c0 = mix(vec3(1.0), u_colors[0], u_intensity);
  vec3 c1 = mix(vec3(1.0), u_colors[1], u_intensity);
  vec3 c2 = mix(vec3(1.0), u_colors[2], u_intensity);
  vec3 color = (c0 * w0 + c1 * w1 + c2 * w2) / (w0 + w1 + w2);

  float alpha = mask * u_opacity;
  gl_FragColor = vec4(color * alpha, alpha); // alfa premultiplicado
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace("#", "");
  const n = parseInt(value.length === 3 ? value.replace(/./g, "$&$&") : value, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function MeshGradient({
  circles = NO_CIRCLES,
  fill = false,
  mobileCircles,
  className = "",
  intensity = 0.25,
  opacity = 0.7,
}: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return; // sin WebGL: se queda el respaldo CSS (ver _mesh-gradient.scss)
    canvas.classList.add("is-webgl");

    const program = gl.createProgram()!;
    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Un rectángulo que cubre todo el canvas (dos triángulos).
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const styles = getComputedStyle(canvas);
    const colors = [
      hexToRgb(styles.getPropertyValue("--color-accent")),
      hexToRgb(styles.getPropertyValue("--color-primary")),
      hexToRgb(styles.getPropertyValue("--color-background")),
    ];
    gl.uniform3fv(u("u_colors"), colors.flat());
    // Círculos según el ancho de pantalla (y se actualizan si cambia).
    const wide = window.matchMedia("(min-width: 64em)");
    const setCircles = () => {
      const list = !wide.matches && mobileCircles ? mobileCircles : circles;
      const slots = [0, 1, 2].map((i) => list[i] ?? { x: 0, y: 0, r: 0 }); // radio 0 = no se dibuja
      gl.uniform3fv(u("u_circles"), slots.flatMap(({ x, y, r }) => [x, y, r]));
    };
    setCircles();
    gl.uniform1f(u("u_intensity"), intensity);
    gl.uniform1f(u("u_opacity"), opacity);
    gl.uniform1f(u("u_fill"), fill ? 1 : 0);

    // Media resolución: un degradado suave no necesita más y la tarjeta gráfica trabaja 4 veces menos.
    const RESOLUTION = 0.5;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * RESOLUTION));
      canvas.height = Math.max(1, Math.round(height * RESOLUTION));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u("u_size"), canvas.width, canvas.height);
    };

    const draw = (seconds: number) => {
      gl.uniform1f(u("u_time"), seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw(gsap.ticker.time);
    });
    sizeObserver.observe(canvas);

    // Anima solo si el visitante acepta movimiento y mientras el canvas está en pantalla.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = () => draw(gsap.ticker.time);
    let running = false;
    const setRunning = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };
    let visible = false;
    const update = () => setRunning(visible && !reduceMotion.matches);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting; // el aviso más reciente
      update();
    });
    visibility.observe(canvas);
    reduceMotion.addEventListener("change", update);
    const onWideChange = () => {
      setCircles();
      draw(gsap.ticker.time);
    };
    wide.addEventListener("change", onWideChange);

    resize();
    draw(0);

    return () => {
      setRunning(false);
      sizeObserver.disconnect();
      visibility.disconnect();
      reduceMotion.removeEventListener("change", update);
      wide.removeEventListener("change", onWideChange);
      // Se liberan solo los recursos creados aquí (no el contexto): si el efecto se reinicia,
      // el mismo canvas puede volver a dibujar.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [circles, fill, mobileCircles, intensity, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`mesh-gradient ${fill ? "mesh-gradient--fill" : ""} ${className}`}
      aria-hidden="true"
    />
  );
}
