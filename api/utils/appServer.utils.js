import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from '../routes/routes.js';
import { originProcess } from '../configs/server.configs.js';
import { errorHandler } from '../middlewares/errorHandler.middleware.js';

class appServer {
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 3000;
        

        this.middlewares();

        this.routes();
        
        this.server = http.createServer(this.app);
        
    }

    middlewares() {
        this.app.use(express.json());   

        this.app.use(
            cors({
                origin: (origin, callback) => {
                    if (originProcess.verifyOrigin(origin)) {
                        return callback(null, true);
                    }
                    console.warn('Blocked CORS origin:', origin);
                    callback(new Error('Not allowed by CORS'));
                },
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            })
        );
       
        this.app.options('*', cors());
        
    }

    routes() {
        this.app.get('/', (req, res) => {
            res.send('Backend do Marketplace está on! 🚀');
        });

        this.app.post('/teste', (req, res) => {
            console.log('REQ.BODY =', req.body);
            console.log('HEADERS =', req.headers['content-type']);
            res.json({
                body: req.body,
                headers: req.headers['content-type'],
            });
        });

        this.app.use('/api', routes);

        this.app.use(errorHandler);
    }

}

export { appServer };