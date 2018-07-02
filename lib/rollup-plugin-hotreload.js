import { randomBytes } from "crypto";
import {
  readFile,
  writeFile,
  createReadStream,
  createWriteStream
} from "fs";
import { join } from "path";
import { Transform } from "stream";

var _hashkey = randomBytes(6).toString('hex');
var obj = { reqNow: null, hashKey: _hashkey, copyStr: null, isAppend: false };
var rphPath = "/rollup-plugin-hotreload";
var buildPaths = [];
var isCopyFilePathToHotreloadJs = false;
var rootDir = null;
var copyPaths = [];
export function rph(options) {
  if (!options.rootDir)
    throw TypeError("rootDir is needed!");

  if (!Array.isArray(options.buildPaths))
    throw SyntaxError("buildPaths must have at least ONE file");

  if (!options.server)
    throw SyntaxError("Server is needed!");

  if (!options.templateHtmlPath)
    throw SyntaxError("templatePath html is needed!");

  rootDir = options.rootDir;
  buildPaths = options.buildPaths.slice();
  var is_stop_rph = !!options.isStopRPH;
  var server = options.server;

  for (let index = 0; index < buildPaths.length; index++) {
    let element = buildPaths[index];
    if (!element[0] && !element[1]) {
      throw TypeError("both the first: build file path and \
    the second: source path are needed!");
    }
    copyPaths = copyPaths.concat(`"${element[0]}"`);
  }
  obj.copyStr = copyPaths.join(",");

  function sockethandlerTEST() {
    if (is_stop_rph)
      return;
    this.hashKey = randomBytes(6).toString('hex');
    server.on("request", function (req, res) {
      if (req.url === rphPath) {
        this.reqNow = req;
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        res.write("data: " + this.hashKey + "\n\n");
      }
    }.bind(this));

    if (this.reqNow !== null) {
      this.reqNow.on('close', function () {
        console.warn("close isReload");
      });
    }
  }
  return {
    name: "rollup-plugin-hotreload",
    ongenerate: sockethandlerTEST.bind(obj),
    onwrite: function (opts) {
      // ONLY ONCE
      if (!isCopyFilePathToHotreloadJs) {

        // read hotreload.js and inject loaded js
        // rootDir = build/
        // copy ./hotreload.js to ./build/js/hotreload.js
        // NOTE: hotreload.js in the same directory as rootDir
        createReadStream("./hotreload.min.js")
          .pipe(copyTransform)
          .pipe(createWriteStream(`./${rootDir}/hotreload.min.js`));

        isCopyFilePathToHotreloadJs = true;
      }

      readFile(join(__dirname, options.templateHtmlPath), "utf8", function (err, htmlString) {
        if (err) throw err;
        /*
          Inspired by rollup-plugin-generate-html-template@bengsfort
          How to append js in html
        */
        var newHtmlString = [
          htmlString.slice(0, htmlString.indexOf("</body>")),
          `<script type="text/javascript" src="/hotreload.min.js"></script>\n`,
          htmlString.slice(htmlString.indexOf("</body>"), htmlString.length)
        ].join("");
        writeFile(join(__dirname, `./${rootDir}/index.html`), newHtmlString, function (err) {
          if (err) throw err;
        });
      });
    }
  };
}
const copyTransform = new Transform({
  transform(chunk, encoding, callback) {
    if (!obj.isAppend && obj.copyStr !== null) {
      this.push(`var loadfilePath = [${obj.copyStr}];\n`);
      obj.isAppend = true;
    }
    this.push(chunk);
  }
});

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

function multibundles(config, dirname) {
  if (!Array.isArray) {
    throw SyntaxError("Array.isArray is not supported!");
  }
  let buildArr = [];
  for (let index = 0; index < buildPaths.length; index++) {
    let element = buildPaths[index];
    if (!element[0] && !element[1]) {
      throw TypeError("both the first: build file path and \
      the second: source path are needed!");
    }
    buildArr = buildArr.concat(bundle(config, dirname, join(rootDir, element[0]), element[1]).module);
  }
  return buildArr;
}

export {
  multibundles as rphMultibundles
};