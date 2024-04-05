import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const libName = 'vimath';


export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: libName,
            fileName: libName,
            formats: ['es', 'umd', 'iife'],
        },
        rollupOptions: {
            output: {
                dir: resolve(__dirname, 'dist'),
                name: libName,
                entryFileNames: `${libName}.[format].js`,
            }
        },
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    },
    plugins: [dts({ rollupTypes: true })],
});