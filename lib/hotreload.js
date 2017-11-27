/*
MIT License

Copyright (c) 2017 Tingwei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
export default function (options) {
  if (!options.server)
    throw new SyntaxError("Server is needed!");
  if (!options.socketio)
    throw new SyntaxError("socket.io is needed!");

  const socketio = options.socketio;
  const server = options.server;
  const port = options.port;
  const reloadMessage = options.message.reload || "reload";
  const disconnectMessage = options.message.disconnect || "byebye";

  function sockethandler(io) {
    io.on(disconnectMessage, function () {
      this.socket = null;
    });

    if (this.socket === null) {
      io.on("connection", (_socket) => {
        this.socket = _socket;
      });
    }
    if (this.socket !== null) {
      this.socket.emit(reloadMessage);
    }
  }

  function inject(socketio, server) {
    const io = socketio(server);
    server.listen(process.env.PORT || port);
    return io;
  }

  var io = inject(socketio, server);
  var obj = { socket: null };
  return {
    name: "rollup-plugin-hotreload",
    ongenerate: sockethandler.bind(obj, io)
  };
}