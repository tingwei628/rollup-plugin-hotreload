# rollup-plugin-hotreload
Hot Reload plugin for Rollup.js

## How to use

> rollup.config.js

```js

import hotreload from "rollup-plugin-hotreload";
import your_socketio from "socket.io";
import your_server from "your_server_path";

export default {
  //...
  plugins: [
    hotreload({
      port: 3000,
      server: your_server,
      socketio: your_socketio,
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

## License
MIT
