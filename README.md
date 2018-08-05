# rollup-plugin-hotreload
Hot Reload plugin for Rollup.js

## Feature

- Multiple files hotreload supported
- Auto injected into HTML supported
- EventSource (depended on browsers)

## How to use

> rollup.config.js

> NOTE: the rollup-plugin-hotreload server port is 9999

> DO NOT USE localhost server port as the same as 9999

```js

import { rph, rphMultibundles } from "rollup-plugin-hotreload";
import path from "path";
import "your_server_path"; // import your server path;

export default rphMultibundles({
  //...
  plugins: [
    rph({
      templateHtmlPath: path.join(__dirname, "src/index.html"), // template html
      isStopRPH: false, // stop hotreload or not
      rootDir: path.join(__dirname, "build"), // build root path
      buildPaths: [
        // first one is relative path to rootDir...
        ["js/index.min.js", "src/index.js"]
        // as many as you want ...
      ]
    })
  ]
}, __dirname);
```


## Installation
```
$yarn add rollup-plugin-hotreload
```

or 

```
$npm install rollup-plugin-hotreload
```

## Test (Todo)
```
$yarn test
```

## Build
```
$yarn build
```

## (ChangeLog)[https://github.com/tingwei628/rollup-plugin-hotreload/blob/master/ChangeLog.md]

## Contributing
Feel free to fork and PR

[Issues](https://github.com/tingwei628/rollup-plugin-hotreload/issues)

## License
MIT
