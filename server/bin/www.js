#!/usr/bin/env node
import app from "../app.js";
import debugLib from "debug";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "../config/database.js";

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  console.error(error);
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
};


dotenv.config();

const debug = debugLib("myapp:server");

const port = normalizePort(process.env.APP_PORT || "3000");
const server = http.createServer(app);

await connectDB();
app.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

