import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

import routes from "./routes/routes.js";
import { RegisterChatSocket } from "./sockets/chat.socket.js";
import { socketAuthMiddleware } from "./middlewares/socketAuth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend do Marketplace está on! 🚀");
});

app.post("/teste", (req, res) => {
  console.log("REQ.BODY =", req.body);
  console.log("HEADERS =", req.headers["content-type"]);
  res.json({
    body: req.body,
    headers: req.headers["content-type"],
  });
});

app.use("/api", routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(socketAuthMiddleware);

RegisterChatSocket(io);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
