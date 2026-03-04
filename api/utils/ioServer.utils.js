import { Server } from "socket.io";
import { RegisterChatSocket } from "../sockets/chat.socket.js";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware.js";
import { originProcess } from "../configs/server.configs.js";

class ioServer {
    constructor(server) {

        this.middlewares(server);

        RegisterChatSocket(this.io);
    }

    middlewares(server) {
        this.io = new Server(server, {
            cors: {
                origin: (origin, callback) => {
                    if (originProcess.verifyOrigin(origin)) return callback(null, true);
                    return callback('Not allowed by CORS', false);
                },
                credentials: true,
            },
            transports: ['websocket', 'polling'],
            allowEIO3: true,
        });
        
        this.io.use(socketAuthMiddleware);
    };
}

export { ioServer };