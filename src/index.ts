import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { dbConfig } from './config/dbConfig';
import routes from './routes';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import errorMiddleware from './middlewares/errorMiddleware';
import { appConfig } from './config/appConfig';

const app = express();
const http = new Server(app);

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

app.listen(appConfig.port, () => console.log('Server running on port ' + appConfig.port));

createConnection(dbConfig).then(() => console.log('DB Connected.'));

const io = new SocketIOServer(http);

io.on('connection', (socket: Socket) => {
  console.log('A user connected.');

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});
