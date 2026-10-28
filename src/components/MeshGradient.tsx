import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

// Degradado de malla animado (mesh gradient) dibujado con WebGL dentro de unos círculos.
// Un "shader" es un pequeño programa que la tarjeta gráfica ejecuta para cada píxel a la vez:
// por eso puede animar un degradado complejo a 60 fps sin cargar el procesador.
// Estilos: styles/components/_mesh-gradient.scss

// Círculo: centro (x, y) y radio r, en fracción del ancho/alto del contenedor (0–1).
export type MeshCircle = { x: number; y: number; r: number };

type MeshGradientProps = {
  circles: MeshCircle[];
  // Distribución opcional para pantallas pequeñas (< 1024 px).
  mobileCircles?: MeshCircle[];
  className?: string;
  // Intensidad del color (0–1). Bajo = pastel, como en el diseño.
  intensity?: number;
};

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

void main() {
  vec2 px = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);

  float mask = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 c = u_circles[i].xy * u_size;
    float r = u_circles[i].z * u_size.x;
    float d = distance(px, c);
    mask = max(mask, 1.0 - smoothstep(r * 0.92, r, d));
  }
  if (mask <= 0.0) { gl_FragColor = vec4(0.0); return; }

  // Coordenadas 0–1 en ambos ejes; los tres puntos de color orbitan alrededor de los círculos
  // (amarillo arriba a la izquierda, azul abajo a la derecha, blanco en medio) para que cada
  // círculo mezcle los tres, como en el diseño.
  vec2 st = px / u_size;
  float t = u_time * 0.35;
  vec2 q = st + 0.035 * vec2(sin(st.y * 9.0 + t * 1.7), cos(st.x * 7.0 - t * 1.3));
  vec2 p0 = vec2(0.26 + 0.09 * sin(t * 0.9), 0.30 + 0.10 * cos(t * 0.7));
  vec2 p1 = vec2(0.42 + 0.08 * cos(t * 0.8), 0.62 + 0.12 * sin(t * 1.1));
  vec2 p2 = vec2(0.32 + 0.10 * sin(t * 0.6 + 2.0), 0.50 + 0.14 * cos(t * 0.9 + 1.0));
  float w0 = 1.0 / (0.004 + pow(distance(q, p0), 2.0));
  float w1 = 1.0 / (0.004 + pow(distance(q, p1), 2.0));
  float w2 = 1.0 / (0.006 + pow(distance(q, p2), 2.0));
  vec3 color = (u_colors[0] * w0 + u_colors[1] * w1 + u_colors[2] * w2) / (w0 + w1 + w2);

  float alpha = mask * u_intensity;
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

export default function MeshGradient({ circles, mobileCircles, className = "", intensity = 0.25 }: MeshGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return; // sin WebGL: se queda el respaldo CSS (ver _mesh-gradient.scss)
    canvas.classList.add("is-webgl");

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Un rectángulo que cubre todo el canvas (dos triángulos).
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
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
      gl.uniform3fv(u("u_circles"), list.flatMap(({ x, y, r }) => [x, y, r]));
    };
    setCircles();
    gl.uniform1f(u("u_intensity"), intensity);

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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [circles, mobileCircles, intensity]);

  return <canvas ref={canvasRef} className={`mesh-gradient ${className}`} aria-hidden="true" />;
}
