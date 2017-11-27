import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import path from 'path';

const config = {
  output: {
    file: "",
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV),
    })
  ]
};


function bundle(config, outputpath, sourcefilepath) {
  const output1 = Object.assign({}, config.output, {
    file: path.join(__dirname, outputpath)
  });
  const module1 = Object.assign({}, config, {
    input: path.join(__dirname, sourcefilepath),
    output: output1,
  });
  return module1;
}

export default [
  bundle(config, "build/index.min.js", "src/index.js"),
  // bundle(config, "build/js/hotreload.min.js", "utils/hotreload.js")
];