import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { join } from "path";


const config = {
  output: {
    file: "",
    name: "rollup-plugin-hotreload",
    format: 'umd',
    sourcemap: true,
    globals: {
      crypto: 'crypto',
      fs: 'fs',
      path: 'path',
      stream: 'stream',
      http: 'http'
    },
  },
  external: [
    'crypto',
    'fs',
    'path',
    'stream',
    'http',
  ],
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    uglify()
  ]
};
function bundle(config, dirname, outputpath, sourcefilepath) {
  const buildModule = { module: null, outputPath: null };
  const output1 = Object.assign({}, config.output, {
    file: join(dirname, outputpath)
  });
  const module1 = Object.assign({}, config, {
    input: join(dirname, sourcefilepath),
    output: output1,
  });
  buildModule.module = module1;
  buildModule.outputPath = outputpath;
  return buildModule;
}
export default [
  bundle(config, __dirname, "build/index.min.js", "src/index.js").module,
  bundle(config, __dirname, "build/hotreload.min.js", "lib/hotreload.js").module
];