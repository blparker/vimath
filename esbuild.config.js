// const esbuild = require('esbuild');
// const glob = require('glob');
import * as esbuild from 'esbuild'

// ./node_modules/.bin/esbuild src/index.js --bundle --sourcemap --outdir=../dist --global-name=vimath --watch --format=esm
/*esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    sourcemap: true,
    globalName: 'vimath',
    format: 'esm',
    outdir: './dist/out',
    watch: true,
}).then(() => {
    console.log('Build complete...');
});*/

const context = await esbuild.context({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    sourcemap: true,
    globalName: 'vimath',
    format: 'esm',
    outdir: './dist/out',
    alias: {
        '@': path.resolve(__dirname, 'src'),
    }
});

// Manually do an incremental build
const result = await context.rebuild();

// Enable watch mode
await context.watch();

// Enable serve mode
await context.serve();

// Dispose of the context
context.dispose();
