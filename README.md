# rollup-plugin-hotreload
>Hot Reload plugin for Rollup.js

![](https://travis-ci.org/tingwei628/rollup-plugin-hotreload.svg?branch=master)

## Feature

- Multiple files hotreload supported
- Auto injected into HTML supported
- EventSource (depended on browsers)

## How to use

> NOTE: the rollup-plugin-hotreload server port is 9999

> :DO NOT USE localhost server port as the same as 9999

> rollup.config.js

```js

import { rph, rphMultibundles } from "rollup-plugin-hotreload";
import path from "path";
import "your_server_path"; // import your server path;

export default rphMultibundles({
  //...
  plugins: [
    rph({
      templateHtmlPath: "src/index.html", // template html path relative to rootDir
      isStopRPH: false, // stop hotreload or not
      rootDir: __dirname, // rootDir
      rootBuildDir: "build", // build root path relative to rootDir
      buildPaths: [
        // first one is relative path to rootDir...
        ["js/index.min.js", "src/index.js"]
        // as many as you want ...
      ]
    })
  ]
});
```

> your_server.js

```js
// koa@2.6.2
import Koa from 'koa';
import koaSend from 'koa-send';
const server = new Koa();

server.use(async ctx => {
  await koaSend(ctx, ctx.path, {
    root: __dirname + '/build'
  });
});

server.listen(3005);

export default server;

```


## Installation

```
$npm install rollup-plugin-hotreload --save-dev
```

## Test
```
$npm run test
```

## Build
```
$npm run build
```

## [ChangeLog](https://github.com/tingwei628/rollup-plugin-hotreload/blob/master/ChangeLog.md)

## Contributing
Feel free to fork and PR

[Issues](https://github.com/tingwei628/rollup-plugin-hotreload/issues)

## License
MIT
