import { Server } from 'socket.io';
import {
  handleConnect,
  handleDisconnect,
  handleJoinArticle,
  handleLeaveArticle,
  handleNewComment,
} from './socketEventHandlers';

export interface Client {
  _id: string;
  socketIDs: string[];
}
export type Clients = Client[];

export default function startSocketServer() {
  const io = new Server(5005, {
    cors: {
      origin: '*',
    },
  });

  console.log('✅ Socket server started on port 5005');
  const clients: Clients = [];

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('CONNECT', (user) => handleConnect(socket, clients, user));
    socket.on('disconnect', () => handleDisconnect(socket, clients));

    socket.on('JOIN_ARTICLE', (articleId: string) => handleJoinArticle(socket, articleId));
    socket.on('LEAVE_ARTICLE', (articleId: string) => handleLeaveArticle(socket, articleId));

    socket.on('NEW_COMMENT', (data) => handleNewComment(io, data));
  });
}