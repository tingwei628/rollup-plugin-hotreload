
import { randomBytes } from "crypto";
import {
  readFile,
  writeFile,
  createReadStream,
  createWriteStream
} from "fs";
import { join } from "path";
import { Transform } from "stream";
import http from "http";

function checkInputOptions(options) {
  if (!options.rootDir)
    throw SyntaxError("rootDir is needed!");

  if (!options.rootBuildDir)
    throw SyntaxError("rootBuildDir is needed!");

  if (!Array.isArray(options.buildPaths))
    throw SyntaxError("buildPaths must have at least ONE file!");

  if (!options.templateHtmlPath)
    throw SyntaxError("templatePath html is needed!");
}

function createHashKey() {
  return randomBytes(6).toString('hex');
}

function initHashKeyMap(obj, copySrcPaths) {
  for (var srcIndex = 0; srcIndex < copySrcPaths; srcIndex++)
    if (!obj.hashKeyMap.has(copySrcPaths[srcIndex]))
      obj.hashKeyMap.set(copySrcPaths[srcIndex], createHashKey())
}

function checkModuleHashKey(obj, modules) {
  if (!Array.isArray(modules))
    throw SyntaxError("modules should be the array");
  modules.forEach(module => {
    // check each module
    if (obj.hashKeyMap.has(module.id)) {
      delete obj.hashKeyMap[module.id];
      obj.hashKeyMap.set(module.id, createHashKey());
    }
  });
}

function bundle(config, dirname, outputpath, sourcefilepath) {
  const buildModule = { module: null, outputPath: null };
  const output1 = Object.assign({}, config.output, {
    file: outputpath,
  });
  const module1 = Object.assign({}, config, {
    input: join(dirname, sourcefilepath),
    output: output1,
  });
  buildModule.module = module1;
  buildModule.outputPath = outputpath;
  return buildModule;
}

// collect source paths
function getCopyStrPaths(buildPaths, dirname) {
  let srcPathArr = [];
  for (let index = 0; index < buildPaths.length; index++) {
    let element = buildPaths[index];
    if (!element[0] && !element[1]) {
      throw SyntaxError("both the first: build file path and \
      the second: source path are needed!");
    }
    srcPathArr = srcPathArr.concat(join(dirname, element[1]));
  }
  return srcPathArr;
}

function getBuildArr(config, buildPaths, dirname, rootBuildDir) {
  if (!Array.isArray) {
    throw SyntaxError("Array.isArray is not supported!");
  }
  let buildArr = [];
  for (let index = 0; index < buildPaths.length; index++) {
    let element = buildPaths[index];
    if (!element[0] && !element[1]) {
      throw SyntaxError("both the first: build file path and \
      the second: source path are needed!");
    }
    buildArr = buildArr.concat(bundle(config, dirname, join(rootBuildDir, element[0]), element[1]).module);
  }
  return buildArr;
}

function processTemplateHtml(templateHtmlPath, rootDir) {
  readFile(templateHtmlPath, "utf8", function (err, htmlString) {
    if (err) throw err;
    /*
      Inspired by rollup-plugin-generate-html-template@bengsfort
      How to append js in html
    */
    var newHtmlString = [
      htmlString.slice(0, htmlString.indexOf("</body>")),
      `<script type="text/javascript" src="hotreload.min.js"></script>\n`,
      htmlString.slice(htmlString.indexOf("</body>"), htmlString.length)
    ].join("");
    writeFile(`${rootDir}/index.html`, newHtmlString, function (err) {
      if (err) throw err;
    });
  });
}

function getCopyTransForm(obj) {
  const copyTransform = new Transform({
    transform(chunk, encoding, callback) {
      if (!obj.isAppend && obj.copyStr !== null) {
        this.push(`var loadfilePath = [${obj.copyStr}];\n`);
        obj.isAppend = true;
      }
      this.push(chunk);
    }
  });
  return copyTransform;
}

function pipeHotReloadJS(obj, rootBuildDir) {
  // read hotreload.js and inject loaded js
  // rootBuildDir = build/
  // copy ./hotreload.min.js to rootBuildDir/hotreload.min.js
  // NOTE: hotreload.js in the same directory as rootBuildDir
  var rs = createReadStream(join(__dirname, "hotreload.min.js"));
  rs.pipe(getCopyTransForm(obj))
    .pipe(createWriteStream(rootBuildDir + "/hotreload.min.js"));
}

function createWatchFileServer(obj) {
  let rphPath = "/rollup-plugin-hotreload";
  let watchFileServer = http.createServer(function (req, res) {
    if (req.url === rphPath && !res.finished) {
      obj.req = req;
      obj.res = res;
    }
  }).listen(9999);
  return watchFileServer;
}

function responseCallback(hashKey, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.write("data: " + hashKey + "\n\n");
  res.end();
}

export {
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
}