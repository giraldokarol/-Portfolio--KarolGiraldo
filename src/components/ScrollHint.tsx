import { Lottie } from "lottie-react";

import animationData from "@/assets/animations/scroll_down.json";

// Icono animado de "haz scroll". Lottie ya no arranca solo si el
// visitante pide reducir el movimiento (prefers-reduced-motion).
export default function ScrollHint() {
  return <Lottie src={animationData} loop autoplay className="w-15" />;
}
