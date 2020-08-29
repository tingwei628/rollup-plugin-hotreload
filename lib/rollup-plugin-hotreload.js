import { join } from "path";
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
  getBuildArr,
} from './helpers';
var _hashkey = createHashKey();
var _hashKeyMap = new Map(); // key:module path -> value:hashkey
var obj = {
  req: null,
  res: null,
  hashKey: _hashkey,
  hashKeyMap: _hashKeyMap,
  copyStr: null,
  isAppend: false
};
var rphPath = "/rollup-plugin-hotreload";
var buildPaths = [];
var isCopyFilePathToHotreloadJs = false;
var rootDir = null;
var rootBuildDir = null;
var templateHtmlPath = null;
var copyPaths = [];
var copySrcPaths = [];
var rphServer = null;
if (!rphServer) {
  rphServer = createWatchFileServer(obj);
}

export function rph(options) {
  checkInputOptions(options);

  // __dirname
  rootDir = options.rootDir;

  // relative "build"
  rootBuildDir = join(rootDir, options.rootBuildDir);

  templateHtmlPath = join(rootDir, options.templateHtmlPath);

  buildPaths = options.buildPaths.slice();

  var is_stop_rph = !!options.isStopRPH;

  for (let index = 0; index < buildPaths.length; index++) {
    let element = buildPaths[index];
    if (!element[0] && !element[1]) {
      throw TypeError("both the first: build file path and \
    the second: source path are needed!");
    }
    copyPaths = copyPaths.concat(`"${element[0]}"`);
  }

  obj.copyStr = copyPaths.join(",");
  copyPaths = getCopyStrPaths(buildPaths, rootDir);
  initHashKeyMap(obj, copySrcPaths);

  function sockethandlerTEST(options, bundles) {
    Object.keys(bundles).forEach(id => {
      const chunk = bundles[id];
      checkModuleHashKey(obj, chunk);
	});	

    if (is_stop_rph)
      return;
    obj.hashKey = createHashKey();
    if (obj.res && obj.req) {
      responseCallback(obj.hashKey, obj.res);
    }
  }

  return {
    name: "rollup-plugin-hotreload",
    generateBundle: sockethandlerTEST.bind(obj),
    writeBundle: function (opts) {
      // ONLY ONCE
      if (!isCopyFilePathToHotreloadJs) {
        pipeHotReloadJS(obj, rootBuildDir);
        isCopyFilePathToHotreloadJs = true;
      }
      processTemplateHtml(templateHtmlPath, rootBuildDir);
    },
  };
}

function getMultibundles(config) {
  return getBuildArr(config, buildPaths, rootDir, rootBuildDir);
}

export {
  getMultibundles as rphMultibundles
};
