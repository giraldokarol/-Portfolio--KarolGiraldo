# Hero — especificación

> Estado: **VALIDADA** (decisiones de Karol en la sección 11) · Fase 2 · 2026-10-27
> Figma: [Hero 1 / escena 1](https://www.figma.com/design/6gbzMRMGQDCcRvv2e5EEjm/Marca-Personal?node-id=2055-288) ·
> [Hero 2 / escena 2](https://www.figma.com/design/6gbzMRMGQDCcRvv2e5EEjm/Marca-Personal?node-id=2055-415)

## 1. Idea en una frase
El hero es un **lienzo de Figma**: al llegar ves a Karol (el avatar) grande y vivo; al hacer scroll,
"la diseñadora" selecciona el avatar, lo redimensiona y escribe su presentación con el cursor de texto.
El scroll *es* el proceso de diseño.

## 2. Medidas de Figma (frame de 1728 × 1117)

| Elemento | Escena 1 | Escena 2 |
|---|---|---|
| Avatar ("Doll") | 355 × 380, x 661 · y 385 | 206 × 220 (× 0,58), x 767 · y 292 |
| "Designer" de fondo | ExtraBold 423px (= **24,5vw**), `#fbfbfb`, tracking −0,02em | igual |
| Gradiente | 2 círculos Ø574: `#FFD332` y `#3475F7`, opacidad 10%, desenfoque 100px | igual |
| Redes (vertical) | Light 300, 14px, tracking 0,42em, `#757575`, separación 64px | igual |
| "Hey! I'm Karol" | — | ExtraBold 110px, `#1a1a1a`, tracking −0,04em |
| "Product Designer" | — | ExtraBold **122px**, `#3475F7`, tracking −0,04em |
| Subtítulo | — | Regular 24px, negro, tracking −0,04em, ancho 791px |
| Icono de mouse | abajo, centrado, enlace a Projects | igual |

Notas:
- **Fuente de verdad: Figma.** Colores, tamaños, pesos y espaciados del hero salen de Figma, no del CSS actual
  (token nuevo `--color-ink: #1a1a1a`; "Designer" en `#fbfbfb` sólido, no con opacidad).
- En pantallas distintas de 1728px los tamaños se escalan con `clamp()` desde estas medidas.
- **Todo centrado horizontalmente** en las dos escenas (en Figma el avatar de la escena 1 está 25px
  a la izquierda; se corrige al centro).

## 3. Revisión de capas del avatar en Figma

Estructura actual:
```
Doll
├─ Girl
│  ├─ Right Ear · Left Ear · Neck
│  ├─ Face
│  │  ├─ Right Eye ─ Right Lashes (Right Lash, Right Lash) · Right Eye · Right Eyebrow
│  │  ├─ Left Eye  ─ Left Eye · Lashes Left (Lashes Left, Lashes Left) · Left Eyebrow
│  │  ├─ Glow Face Right · Glow Face Left · Mouth · Nose · Face
│  └─ Hair ─ Hair · Small Shadow Hair · Long Shadow Hair · Shine Hair
├─ big circle
└─ Ancla ─ square · line rigth · line Left · Point Right · Point Left
```

✅ Bien: ojos, cejas, pestañas, mejillas, boca, nariz, orejas y cuello ya están separados.
Eso basta para el parpadeo y para mover los ojos.

❗ Lo que hay que corregir (en orden de importancia):

1. ~~Separar el pelo~~ **No hace falta**: al exportar se vio que `Hair` ya es solo la silueta del pelo
   de atrás, y el flequillo forma parte del contorno de la cara (`Face`). Pelo trasero y flequillo
   ya se mueven por separado.
2. ~~Relleno blanco detrás de la cara~~ **Descartado por Karol** (se veía raro): la cara, orejas y cuello son
   transparentes (`--avatar-skin: transparent`). Para que el pelo trasero no se vea *a través* de la cara al moverse,
   la parte 2 usará una **máscara SVG** (las formas `*-skin` ocultan el pelo sin pintar nada). Texto original:
   **Añadir un relleno blanco detrás de la cara** (`Face Skin`, mismo contorno que `Face`, relleno `#FFFFFF`,
   justo debajo de las líneas de la cara). Hoy la cara es transparente: cuando el pelo de atrás se mueva,
   sus líneas se verían *a través* de la cara. Lo mismo para las orejas si el pelo pasa por detrás.
3. **Agrupar lo que parpadea** (sin incluir la ceja, que no debe aplastarse):
   ```
   Right Eye
   ├─ Right Eyebrow
   └─ Right Eyeball      ← nuevo grupo: se aplasta en vertical para parpadear
      ├─ Right Pupil     (hoy "Right Eye")
      └─ Right Lashes
   ```
   Igual en el izquierdo (`Left Eyebrow`, `Left Eyeball` → `Left Pupil`, `Left Lashes`).
4. **Nombres claros y únicos.** Al exportar, Figma añade `_2` cuando un hijo se llama igual que su grupo.
   - `Face` (el contorno) → `Face Outline`
   - `Glow Face Right/Left` → `Right Cheek` / `Left Cheek`
   - `Lashes Left` → `Left Lashes`
   - `line rigth` → `Line Right`; `Point Rigth` → `Point Right`
   - `big circle` → `Frame Circle`; `square` → `Handle Square`; `Ancla` → `Anchor`
5. **Quitar la transformación del círculo.** `big circle` está girado 180° y volteado; exporta con
   transformaciones raras. Selecciónalo y usa `Object → Flatten` (⌘E).
6. **Un solo avatar.** Hoy hay dos copias (escena 1 y escena 2). Conviértelo en **componente** (`Avatar`)
   con instancias en las dos escenas. Así hay una sola fuente y la escena 2 es la misma a escala 0,58.
7. **Exportar como SVG** con `Include "id" attribute` activado (en Export → ⋯).

ℹ️ Las líneas del avatar son **rellenos**, no trazos (se convirtieron con "Outline stroke").
**Decisión:** Claude reconstruye el avatar con **trazos** (`stroke`) aplicando las correcciones 1–6
(ver sección 3.1). Así se puede animar con DrawSVG y las líneas se mantienen nítidas al escalar.

### 3.1 Reconstrucción con trazos (Claude)
Cada línea actual es el contorno de un trazo con puntas redondeadas: dos bordes paralelos + dos semicírculos.
1. Leer cada forma, separar sus dos bordes y calcular la **línea central** (el punto medio entre ambos)
   y el **grosor** (la distancia entre ambos).
2. Redibujarla como `<path stroke-width="…" stroke-linecap="round" fill="none">`.
3. Formas que son anillos (contorno de la cara, círculo, cuadrado, puntos del ancla) → línea central del anillo.
4. Lo que es relleno de verdad se queda como relleno: pupilas, mejillas, nariz, círculos amarillos.
5. Aplicar las correcciones: relleno blanco de cara, orejas y cuello, grupos `eyeball-*`, nombres limpios, un solo avatar.
6. **Verificar**: renderizar original y versión con trazos superpuestos y compararlos píxel a píxel con Playwright.

**Resultado (hecho):** `src/assets/avatar/avatar.svg` — 23 trazos, **97,8 % de coincidencia** con el original
(cada forma entre 94 % y 100 %). Grosores: líneas 5,3 px · pestañas 4,4 px · cejas 6,6 px · círculo y ancla 4,39 px.
Diferencias aceptadas: las cejas del original se afinan levemente en una punta (un trazo tiene grosor constante).

Capas (ids) para animar:
```
avatar
├─ girl
│  ├─ hair-back      hair · hair-shadow-small · hair-shadow-long · hair-shine   (parallax contrario)
│  ├─ ears           ear-right / ear-left  (skin blanco + line + shadow)
│  ├─ neck           neck-skin · neck-shadow · neck-line
│  └─ face           face-skin · cheek-* · face-outline (incluye flequillo) · nose · mouth
│                    eye-right / eye-left → eyebrow-* + eyeball-* (pupil-* + lashes-*)  ← parpadeo
└─ frame             frame-circle · anchor (line-left/right · handle · point-left/right)
```

## 4. Escena 1 — inicio, sin scroll

Visible: header, avatar grande centrado, "Designer" gigante detrás (decorativo, `aria-hidden`),
gradientes, redes en vertical, indicador de scroll.

**Sin cursor personalizado:** el puntero del ratón es el normal del sistema. Lo que reacciona a él
es el **gradiente** y la **muñeca**.

**"Designer" de fondo es fijo:** siempre presente, en `#fbfbfb`, en las dos escenas y en los tres idiomas.
No se anima.

### 4.1 Gradiente que sigue al mouse
- Dos "manchas" (`div`) como en Figma: círculo Ø574 px, `filter: blur(100px)`, pero con **opacidad 20 %** (Figma: 10 %; decisión de Karol, variable `--blob-opacity`), (en vw, con mínimo
  de 320 px en móvil). Moverlas con `transform` es barato: el desenfoque se pinta una vez y la capa solo se desplaza
  (medido: 8,3 ms/fotograma). Un `radial-gradient` mostraba más bandas de color.
- Se mueven con `transform: translate(var(--blob-x), var(--blob-y))`. GSAP actualiza esas variables
  con `gsap.quickTo` (una función reutilizable que anima suavemente hacia el último valor).
- Retraso distinto por mancha (amarilla 0,9s; azul 1,3s) para que se sientan "líquidas".
- Recorrido amplio para que se note (amarilla ±17 %, azul ±12 % de la pantalla; decisión de Karol) para que nunca dejen el centro vacío.
- **Hecho** en `src/components/hero/useHeroGradient.ts`.

### 4.2 Avatar vivo
- **Parallax por capas** (solo con ratón: `(hover: hover) and (pointer: fine)`). Posición del puntero
  normalizada de −1 a 1 desde el centro:

  | Capa | Movimiento máx. | Retraso |
  |---|---|---|
  | Pupilas + pestañas | 6px | 0,3s |
  | Flequillo (`Bangs`) | 4px | 0,5s |
  | Cara, mejillas, boca, nariz | 3px | 0,6s |
  | Orejas, cuello | 2px | 0,7s |
  | Pelo trasero (`Hair Back`) | **−3px** (contrario) | 0,9s |
  | Círculo + ancla | 0 (es el marco) | — |

  Además, una rotación leve de la cabeza (±2°). Todo dentro del círculo (`clip-path`).
  Si el puntero sale de la ventana, el avatar vuelve al centro.
- **Parpadeo aleatorio**: cada 2,5–6s se aplasta `Eyeball` en vertical (0,12s). A veces doble parpadeo.
  Se pausa cuando el hero no está en pantalla o la pestaña está oculta.
- **Hecho** en `src/components/hero/useHeroAvatar.ts`, con valores más expresivos que la tabla (decisión de Karol:
  que se note): cara + orejas 7, ojos +5,5 (total 12,5), cuello 2,5, pelo −6, inclinación ±4°. Las orejas se mueven
  con la cara para no despegarse. El pelo se oculta tras la cara con una **máscara SVG** sincronizada cada fotograma.
- **Separación técnica clave**: el *tracking* mueve las capas internas y el *scroll* mueve el contenedor
  exterior. Así no se pelean por la misma propiedad `transform`.

### 4.3 Indicador de scroll (mouse)
- Abajo y centrado, **en las dos escenas**. Ya es un SVG + animación CSS (sustituyó a Lottie).
- **Es un enlace a `#projects`**: quien no quiera ver la animación hace clic y salta a Projects.
  Quien siga haciendo scroll ve la animación completa.
- Como el `pin` añade su propio espacio, `#projects` queda *después* de la animación: el clic la salta entera.

## 5. Escena 2 — final del scroll
Avatar pequeño arriba, `h1` ("Hey! I'm Karol" + "Product Designer" en azul), subtítulo.
**Esta escena es el HTML real**: es lo que se prerenderiza, lo que lee Google, lo que ve quien tiene
reduced-motion y lo que ve quien no tiene JavaScript. La escena 1 es un *estado inicial* que aplica la animación.

## 6. Transición con scroll

ScrollTrigger con `pin` (el hero se queda fijo) y `scrub` (la animación avanza con el scroll),
durante **+150% de la altura de pantalla** en escritorio y +100% en móvil.

### 6.1 Propuesta: "el lienzo de Figma"

```
progreso   0 ──── 0,15 ──────── 0,45 ────────── 0,8 ──── 1
caja       dibuja ▸ redimensiona ▸·····················▸ deselecciona
avatar             ▸ 355×380 → 206×220, sube ▸
saludo                           ▸ se escribe letra a letra ▸
Product Designer                       ▸ se escribe ▸ contorno → relleno azul ▸
subtítulo                                             ▸ aparece ▸
"Designer" fondo   (fijo, no se anima)
```

1. **Selección (0–0,15).** Aparece una caja de selección de Figma alrededor del avatar: borde azul de 1px
   dibujado con **DrawSVG**, cuadraditos en las esquinas y una etiqueta con las medidas `355 × 380`.
2. **Redimensionar (0,15–0,45).** El avatar se encoge y sube hasta su sitio en la escena 2, y la etiqueta
   cuenta las medidas hasta `206 × 220`.
   Técnica **FLIP**: el HTML está en la escena 2; medimos dónde estaría el avatar en la escena 1
   y lo "invertimos" hasta ahí. El scroll lo devuelve a su sitio. Funciona con cualquier tamaño de pantalla.
3. **Escritura (0,45–0,8).** El saludo ("Hey! I'm Karol" / "¡Hola! Soy Karol" / "Hello ! Moi c'est Karol")
   y después "Product Designer" se escriben letra a letra con un **cursor de texto** (la barra vertical
   que parpadea al escribir en Figma; *no* es un cursor de ratón). SplitText separa en letras.
   Las letras existen siempre y solo cambia su visibilidad, así que el tamaño del título no cambia
   mientras se escribe.
4. **Relleno (0,7–0,92).** El texto azul **"Product Designer"** se escribe primero en **contorno** azul
   (`-webkit-text-stroke`) y luego se rellena de azul con un barrido de izquierda a derecha.
5. **Cierre (0,85–1).** El subtítulo aparece por líneas (SplitText `lines` + `mask`) y la caja de selección
   desaparece (como al hacer clic fuera del lienzo). El icono de mouse sigue visible durante todo el recorrido.
   Termina el `pin` y la página sigue hacia Projects.

### 6.2 Tres idiomas
- **"Product Designer" es igual en los tres idiomas** (es el término que se usa al buscar trabajo),
  y "Designer" de fondo también. Solo cambian el **saludo** y el **subtítulo**.
- Nada tiene medidas fijas por idioma: todo se **mide en el navegador** (FLIP, SplitText).
- `SplitText` con `autoSplit: true` y animaciones dentro de `onSplit()`: si la fuente termina de cargar
  o cambia el ancho, se vuelve a partir el texto sin romper la animación.
- El saludo francés es el más largo y puede ocupar 2 líneas en pantallas medianas (`text-wrap: balance`);
  la escritura y el cursor de texto siguen el texto de línea en línea.
- Al cambiar el tamaño de la ventana, `ScrollTrigger.refresh()` vuelve a medir (`invalidateOnRefresh`).

## 7. Móvil y táctil (sin cursor)
- **Gradiente**: deriva lenta y autónoma (bucle suave); se pausa fuera de pantalla.
- **Avatar**: parpadeo + "mira alrededor" cada pocos segundos (las pupilas se mueven solas).
- **Scroll**: misma historia más corta (+100%): selección → redimensionar → escritura → relleno.
- Altura con `svh` y `ScrollTrigger.config({ ignoreMobileResize: true })`, para que la barra
  del navegador no haga saltar la animación.

## 8. Reduced motion, sin JavaScript y SEO
- `prefers-reduced-motion: reduce` → **escena 2 directa**: sin pin, sin tracking, sin parpadeo,
  sin cursor que parpadea y gradiente quieto. Todo con `gsap.matchMedia()`.
- **Sin parpadeo de la escena 2 al cargar**: un script mínimo en `<head>` añade la clase `has-motion` a
  `<html>` antes del primer pintado (solo si no hay reduced-motion). El CSS de `.has-motion` ya muestra
  el estado de la escena 1, y luego GSAP toma el control.
- El `h1` es texto real desde el HTML prerenderizado. Nunca `display: none` en el texto.
  SplitText (`aria: "auto"`) añade `aria-label` al título para que los lectores de pantalla lo lean entero.

## 9. Estructura técnica
```
src/components/hero/
  Hero.tsx              estructura + refs; sin lógica de animación
  Avatar.tsx            SVG en línea con data-part="pupil-right", "hair-back"…
  SelectionBox.tsx      caja de Figma (SVG con trazos para DrawSVG) + etiqueta de medidas
  useHeroPointer.ts     gradiente + parallax + parpadeo
  useHeroScroll.ts      timeline con ScrollTrigger
src/lib/gsap.ts         registra ScrollTrigger, SplitText, DrawSVG y useGSAP una sola vez
src/styles/sections/_hero.scss
src/styles/components/_avatar.scss, _selection-box.scss
```
- `useGSAP` con `scope` (limpia todo al desmontar) + `gsap.matchMedia()` para escritorio, móvil y reduced-motion.

## 10. Tareas

| # | Tarea | Quién | Depende de |
|---|---|---|---|
| ~~T0~~ | Avatar con trazos + correcciones — **hecho**: `src/assets/avatar/avatar.svg` (97,8 %) | Claude | — |
| T1 | `Avatar.tsx` estático desde el SVG de T0, con `data-part` por capa + `_avatar.scss` | **Codex** | T0 |
| T2 | Escena 2 estática fiel a Figma: tipografía `clamp()`, `--color-ink`, redes, "Designer" `#fbfbfb`; sin animación | **Codex** | T1 |
| ~~T3~~ | Icono de mouse en SVG — **hecho** por Claude (Lottie eliminado) | — | — |
| ~~T0b~~ | Componente `Avatar / Strokes` en Figma — **hecho** ([nodo 2058:76](https://www.figma.com/design/6gbzMRMGQDCcRvv2e5EEjm/Marca-Personal?node-id=2058-76)), colores enlazados a `Primary Color` y `Yellow` | Claude | T0 |
| T4 | Infraestructura: `lib/gsap.ts`, script `has-motion`, estados iniciales | Claude | T2 |
| T5 | Gradiente con mouse + deriva en móvil | Claude | T4 |
| T6 | Avatar: parallax por capas + parpadeo + "mira alrededor" | Claude | T1, T4 |
| T7 | Timeline: pin, FLIP del avatar, caja de selección con DrawSVG, medidas | Claude | T4 |
| T8 | Texto: escritura con cursor de texto, "Product Designer" contorno → relleno, subtítulo | Claude | T7 |
| T9 | Móvil + reduced-motion + robustez al redimensionar | Claude | T5–T8 |
| T10 | Pruebas en `/en`, `/fr`, `/es` × escritorio y móvil con Playwright | Claude | T9 |

Codex hace lo **estático y bien definido** (T1–T3) y Claude la animación (T4–T10), revisa los cambios
de Codex con `git diff` y hace los commits. Orden de la Fase 3 = el que pediste:
gradiente (T5) → avatar (T6) → timeline (T7–T8) → móvil/reduced-motion (T9) → idiomas (T10).

## 11. Decisiones de Karol (2026-10-27)
- **P1.** Icono de mouse en las dos escenas, clicable → salta a Projects; el scroll sigue mostrando la animación.
- **P2.** "Designer" de fondo fijo en `#fbfbfb`; "Product Designer" igual en los tres idiomas.
- **P3.** Todo el hero siempre centrado en pantalla.
- **P4.** Usar exactamente los valores de Figma, ignorando el CSS actual.
- **P5.** Quitar lo que pese mucho manteniendo la animación del mouse → hecho (SVG + CSS).
- **P6.** Claude reconstruye el avatar con trazos.
- **P7.** Sí: guardar el avatar con trazos en Figma como componente nuevo, sin tocar el original.
- **P8.** Sí al cursor de texto (barra vertical que parpadea) al escribir el título, para que se vea real.
- Sin cursor de ratón personalizado: el gradiente y la muñeca siguen al puntero normal.
