# rollup-plugin-hotreload
Hot Reload plugin for Rollup.js

## Feature
```
- Support EventSource
- Support multiple files hotreload
- Support auto injected into HTML
- Less dependencies
```

## How to use

> rollup.config.js

```js

import rph from "rollup-plugin-hotreload";
import your_server from "your_server_path";

export default {
  //...
  plugins: [
    rph({
      your_server,
      templateHtmlPath: "src/index.html", // template html
      isStopRPH: false, // stop hotreload or not
      rootDir: "build", // build root path
      buildPaths: [
        // first one is relative path to rootDir
        ["js/index.min.js", "src/index.js"]
      ]
      // reloadMessage: "",    (optional)
      // disconnectMessage: "" (optional)
    })
  ]
}

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

## Contributing
Feel free to fork and PR

[Issues](https://github.com/tingwei628/rollup-plugin-hotreload/issues)

## License
MIT
