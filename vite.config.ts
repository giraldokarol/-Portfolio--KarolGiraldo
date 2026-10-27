import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Reemplaza a @vitejs/plugin-react: añade rutas, prerender y Fast Refresh.
    reactRouter(),
  ],
  resolve: {
    // Alias "@/..." → src/ (definido en tsconfig.app.json). Vite 8 lo hace sin plugin.
    tsconfigPaths: true,
  },
  // Los .scss se compilan con sass-embedded (instalado como devDependency); Vite lo detecta solo.
})
