const fs = require('fs')
const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const { sassPlugin } = require('esbuild-sass-plugin')
const { minifyTemplates, writeFiles } = require('esbuild-minify-templates')

const baseTsConfig = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    treeShaking: true,
    write: false,
    metafile: true,
    external: ['react'],
    plugins: [
        nodeExternalsPlugin({
            allowList: ['@broxus/tvm-connect'],
        }),
        sassPlugin(),
        minifyTemplates(),
        writeFiles(),
    ],
    loader: {
        '.svg': 'dataurl',
    },
}

Promise.all([
    esbuild.build({
        entryPoints: ['./src/styles.scss'],
        minify: true,
        plugins: [sassPlugin()],
        outfile: 'dist/styles.css',
    }),
    esbuild
        .build({
            ...baseTsConfig,
            format: 'esm',
            outfile: 'dist/index.esm.js',
        })
        .then(result => {
            fs.writeFileSync('./buildmeta.json', JSON.stringify(result.metafile, null, 2))
            fs.unlinkSync('./dist/index.esm.css')
        }),
    esbuild
        .build({
            ...baseTsConfig,
            format: 'cjs',
            outfile: 'dist/index.cjs.js',
        })
        .then(() => {
            fs.unlinkSync('./dist/index.cjs.css')
        }),
]).catch(() => process.exit(1))
