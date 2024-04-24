import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: "cjs",
        esModule: false,
        banner: '#!/usr/bin/env node\n'
      },
    ],
    external: [],
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
  }
]

export default config;