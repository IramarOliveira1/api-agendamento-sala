import express from 'express';
import clientRoutes from './routes/client.routes';
import authRoutes from './routes/auth.routes';
import logRoutes from './routes/log.routes';
import roomRoutes from './routes/room.routes';
import schedulingRoutes from './routes/scheduling.routes';

const cors = require('cors'); // 1. Importe o cors

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(clientRoutes);
app.use(authRoutes);
app.use(logRoutes);
app.use(roomRoutes);
app.use(schedulingRoutes);

export default app;