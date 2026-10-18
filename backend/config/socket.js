const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register-wallet", (address) => {
      if (typeof address !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return;
      }

      socket.join(`wallet:${address.toLowerCase()}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}

module.exports = { initializeSocket, getIO };
