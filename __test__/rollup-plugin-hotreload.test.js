import { rphMultibundles } from '../lib/rollup-plugin-hotreload';
import {
  createHashKey,
  initHashKeyMap,
  checkModuleHashKey,
  processTemplateHtml,
  pipeHotReloadJS,
  checkInputOptions,
  getCopyStrPaths,
  createWatchFileServer,
  responseCallback,
  getBuildArr
} from '../lib/helpers';

let config = {
  templateHtmlPath: "src/index.html",
  isStopRPH: false,
  rootDir: __dirname,
  rootBuildDir: "build",
  buildPaths: [
    ["js/index.min.js", "src/index.js"],
    ["js/index2.min.js", "src/index2.js"]
  ]
};
let buildPaths = config.buildPaths;
let dirname = __dirname;


/*
  createHashKey,
  initHashKeyMap,
  checkModuleHashKey,
  processTemplateHtml,
  pipeHotReloadJS,
  checkInputOptions,
  getCopyStrPaths,
  createWatchFileServer,
  responseCallback,
  getBuildArr

*/

describe('test checkInputOptions', () => {
  test('test checkInputOptions - rooDir', () => {
    let options = {};
    expect(() => checkInputOptions(options)).toThrow('rootDir is needed!');
  });
  test('test checkInputOptions - rootBuildDir', () => {
    let options = { rootDir: __dirname };
    expect(() => checkInputOptions(options)).toThrow('rootBuildDir is needed!');
  });
  test('test checkInputOptions - buildPaths', () => {
    let options = { rootDir: __dirname, rootBuildDir: 'build' };
    expect(() => checkInputOptions(options)).toThrow('buildPaths must have at least ONE file!');
  });
  test('test checkInputOptions - templateHtmlPath', () => {
    let options = {
      rootDir: __dirname,
      rootBuildDir: 'build',
      buildPaths: [["js/index.min.js", "src/index.js"]]
    }
    expect(() => checkInputOptions(options)).toThrow('templatePath html is needed!');
  });
});



test('test getMultibundles -> multiBundles', () => {
  let result = rphMultibundles(config);
  expect(Array.isArray(result)).toBeTruthy;
});


describe('test HashKey related functions', () => {

  beforeEach(function () {
    jest.resetModules(); // reset import modules
    jest.resetAllMocks(); // reset all mocks
  });
  test('test createHashKey contains exact 12 numbers', () => {
    let result = createHashKey();
    expect(result).toMatch(/^[a-z0-9]{12}$/);
  });

});