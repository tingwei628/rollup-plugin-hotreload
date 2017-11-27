import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import path from 'path';

const config = {
  output: {
    file: "",
    name: "rollup-plugin-hotreload",
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
      ENV: JSON.stringify(process.env.NODE_ENV || "development"),
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