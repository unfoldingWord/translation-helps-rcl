import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import pkg from './package.json'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        ...Object.keys(pkg.devDependencies),
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
      output: [
        {
          dir: 'dist',
          format: 'es',
          entryFileNames: `[name].[format].js`,
          interop: 'compat',
        },
        {
          dir: 'dist',
          format: 'cjs',
          entryFileNames: `[name].[format].js`,
          interop: 'compat',
        },
      ],
    },
  },
})
