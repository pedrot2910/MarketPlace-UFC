import dotenv from 'dotenv';
import { appServer } from './utils/appServer.utils.js';
import { ioServer } from './utils/ioServer.utils.js';

dotenv.config();

const serverApp = new appServer();

const { server, PORT } = serverApp;

const io = new ioServer(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
