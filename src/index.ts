import cors from 'cors';
import 'reflect-metadata';
import './config/dbConfig';
import dotenv from 'dotenv';
import morgan from 'morgan';
import './config/redisConfig';
import express from 'express';
import routes from './routes';
import { Server } from 'http';
import { appConfig } from './config/appConfig';
import errorMiddleware from './middlewares/errorMiddleware';
import { Socket, Server as SocketIOServer } from 'socket.io';

const app = express();
const http = new Server(app);
const io = new SocketIOServer(http);

dotenv.config();

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  })
);
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload', express.static('upload'));

app.use('/api/v1', routes);
app.use(errorMiddleware);

app.listen(appConfig.port, () => console.log('Server running on port ' + appConfig.port + '.'));

io.on('connection', (socket: Socket) => {
  console.log('A user connected.');

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});
