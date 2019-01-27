import { rphMultibundles } from '../lib/rollup-plugin-hotreload';
// test validate in multibundles
// test expect copyTransform

// test pipe in read/write html
// test write file to another file with string



var config = {
  templateHtmlPath: "src/index.html",
  isStopRPH: false,
  rootDir: __dirname,
  rootBuildDir: "build",
  buildPaths: [
    ["js/index.min.js", "src/index.js"],
    ["js/index2.min.js", "src/index2.js"]
  ]
};
var buildPaths = config.buildPaths;
var dirname = __dirname;


test('test getMultibundles -> multiBundles', () => {
  var result = rphMultibundles(config);
  //expect(Array.isArray(result)).toEqual(true);
  expect(Array.isArray(result)).toBeTruthy;
});