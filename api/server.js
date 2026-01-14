import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

import routes from './routes/routes.js';
import { RegisterChatSocket } from './sockets/chat.socket.js';
import { socketAuthMiddleware } from './middlewares/socketAuth.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const allowedOriginPatterns = [
  /^http:\/\/localhost:5173$/,
  /^https:\/\/market-place-ufc\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/, // fallback seguro
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Mobile / WebView às vezes envia origin null
      if (!origin) return callback(null, true);

      const isAllowed = allowedOriginPatterns.some((pattern) =>
        pattern.test(origin),
      );

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn('Blocked CORS origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Backend do Marketplace está on! 🚀');
});

app.post('/teste', (req, res) => {
  console.log('REQ.BODY =', req.body);
  console.log('HEADERS =', req.headers['content-type']);
  res.json({
    body: req.body,
    headers: req.headers['content-type'],
  });
});

app.use('/api', routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOriginPatterns.some((pattern) =>
        pattern.test(origin),
      );

      if (isAllowed) return callback(null, true);

      return callback('Not allowed by CORS', false);
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

io.use(socketAuthMiddleware);

RegisterChatSocket(io);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
