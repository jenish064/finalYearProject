const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const port = 4001;
const httpServer = http.createServer(app);

const server = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const generateDate = () => {
  const date = Date();
  return date;
};

let timeChenge;
server.on("connection", (socket) => {
  if (timeChenge) clearInterval(timeChenge);
  setInterval(() => socket.emit("message", generateDate()), 1000);
});

httpServer.listen(port);

// const express = require("express");
// const http = require("http");
// const socketio = require("socket.io");

// const SerialPort = require("serialport").SerialPort;
// const Readline = require("@serialport/parser-readline").ReadlineParser;

// const app = express();
// const port = 4001;
// const httpServer = http.createServer(app);

// const com_port = new SerialPort({
//   path: "COM10",
//   baudRate: 9600,
//   parser: new Readline(),
// });

// com_port.pipe(com_port.parser);

// com_port.parser.on("data", (line) => console.log(line));

// const server = new socketio.Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// const generateDate = () => {
//   const date = Date();
//   return date;
// };

// let timeChenge;
// server.on("connection", (socket) => {
//   if (timeChenge) clearInterval(timeChenge);
//   setInterval(() => socket.emit("message", generateDate()), 1000);
// });

// httpServer.listen(port);
