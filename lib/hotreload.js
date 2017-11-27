import socketio from "socket.io";

export default function (options) {
  if (!options.server)
    throw new SyntaxError("Server is needed!");

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