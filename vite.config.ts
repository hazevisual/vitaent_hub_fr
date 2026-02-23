import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@types': resolve(__dirname, 'src/types'),
            "@": resolve(__dirname, "src")
        }
    },
    server: {
        host: '127.0.0.1',
        port: 3001,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'https://localhost:7163',
                changeOrigin: true,
                secure: false
            }
        }
    }
});