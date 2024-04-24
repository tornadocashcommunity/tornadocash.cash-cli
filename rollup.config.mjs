import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import pkgJson from './package.json' assert { type: 'json' };

const external = Object.keys(pkgJson.dependencies).concat(...[
  '@tornado/websnark/src/utils',
  '@tornado/websnark/src/groth16',
]);

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkgJson.main,
        format: "cjs",
        esModule: false,
      },
    ],
    external,
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        minify: false,
        sourceMap: true,
        target: 'es2016',
      }),
      nodeResolve(),
      commonjs(),
      json()
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkgJson.module,
        format: "esm",
      },
    ],
    external,
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        minify: false,
        sourceMap: true,
        target: 'es2016',
      }),
      nodeResolve(),
      json()
    ],
  },
  {
    input: 'src/cli.ts',
    output: [
      {
        file: pkgJson.bin[pkgJson.name],
        format: "cjs",
        esModule: false,
        banner: '#!/usr/bin/env node\n'
      },
    ],
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        minify: false,
        sourceMap: true,
        target: 'es2016',
      }),
      nodeResolve(),
      commonjs(),
      json()
    ],
  },
  {
    input: 'src/merkleTreeWorker.ts',
    output: [
      {
        file: 'static/merkleTreeWorker.js',
        format: "cjs",
        esModule: false,
      },
    ],
    treeshake: 'smallest',
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        minify: false,
        sourceMap: true,
        target: 'es2016',
      }),
      nodeResolve(),
      commonjs(),
      json()
    ],
  },
  {
    input: 'src/merkleTreeWorker.ts',
    output: [
      {
        file: 'static/merkleTreeWorker.umd.js',
        format: "umd",
        esModule: false
      },
    ],
    treeshake: 'smallest',
    external: ['web-worker'],
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        minify: false,
        sourceMap: true,
        target: 'es2016',
      }),
      nodeResolve(),
      commonjs(),
      json(),
      replace({
        'process.browser': 'true'
      })
    ],
  }
]

export default config;