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
<<<<<<< HEAD
        // resolve: {
        //     alias: {
        //         '@': resolve(__dirname, './src'),
        //     },
        // },
        environment: 'jsdom',
        setupFiles: ['./test/mock_offscreen_canvas.ts', './vitest.setup.ts'],
        deps: {
            inline: ['vitest-canvas-mock'],
        },
        // For this config, check https://github.com/vitest-dev/vitest/issues/740
        threads: false,
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/utils/**',
            '**/*.ignore.ts',
            '**/*.spec.js',
        ],
    },
    plugins: [dts({ rollupTypes: true })],
    // plugins: [dts()],
=======
        environment: 'jsdom',
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
        setupFiles: ['./test/mock_offscreen_canvas.ts'],
    },
    plugins: [dts({
        rollupTypes: true,
        // insertTypesEntry: true
    })],
>>>>>>> refactor/master
});