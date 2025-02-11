const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin } = require('esbuild-sass-plugin');
const { minifyTemplates, writeFiles } = require('esbuild-minify-templates');

const baseTsConfig = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    treeShaking: true,
    write: false,
    plugins: [
        nodeExternalsPlugin(),
        sassPlugin(),
        minifyTemplates(),
        writeFiles()
    ],
    loader: {
        '.svg': 'dataurl'
    }
}

Promise.all([
    esbuild.build({
        entryPoints: ['./src/styles.scss'],
        minify: true,
        plugins: [
            sassPlugin(),
        ],
        outfile: 'dist/styles.css',
    }),
    esbuild.build({
        ...baseTsConfig,
        format: 'esm',
        outfile: 'dist/index.esm.js',
    }),
    esbuild.build({
        ...baseTsConfig,
        format: 'cjs',
        outfile: 'dist/index.cjs.js',
    }),
])
    .catch(() => process.exit(1));
