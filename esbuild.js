const esbuild = require('esbuild');
const { existsSync, mkdirSync, writeFileSync} = require('fs');
const {join} = require('path');

const lib = join(process.cwd(), 'lib');

if (!existsSync(lib)) {
  mkdirSync(lib);
}

const externalDeps = ['antd', 'react', 'dayjs', 'jalaliday', 'rc-picker', 'jalali-plugin-dayjs'];

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outdir: 'lib/esm',
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: 'esm',
    target: ['esnext'],
    external: externalDeps,
  })
  .catch(() => process.exit(1));

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'lib/cjs/index.cjs.js',
    bundle: true,
    sourcemap: true,
    minify: true,
    platform: 'node',
    target: ['node16'],
    external: externalDeps,
  })
  .catch(() => process.exit(1));

writeFileSync(join(lib, 'index.js'), "export * from './esm/index.js';");

writeFileSync(join(lib, 'index.cjs.js'), "module.exports = require('./cjs/index.cjs.js');");