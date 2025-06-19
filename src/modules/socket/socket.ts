import { Server } from 'socket.io';
import {
  handleConnect,
  handleDisconnect,
  handleMessageFromClient,
  handleSeenFromClient,
  handleTyping,
  handleMessage,
  handleSeenMessage,
} from './socketEventHandlers';

export interface client {
  socketID: Array<string>;
  conversationId: any;
}
export type Clients = Array<client>;
export default function () {
  const io = new Server(Number(5005), {
    cors: {
      origin: '*',
    },
  });
  console.log('socket running on port', 5005);
  let clients: Clients = [];
  io.on('connection', (socket: any) => {
    socket.on('disconnect', () => handleDisconnect(socket, clients));
    socket.on('CONNECT', (data: any) => handleConnect(socket, clients, data));
    socket.on('NEW_MESSAGE', (data: any) => handleMessageFromClient(socket, io, data, clients));
    socket.on('SEEN', (data: any) => {
      handleSeenFromClient(socket, data, clients);
    });
    socket.on('SEEN_FROM_ADMIN', (data: any) => {
      handleSeenMessage(socket, data, clients);
    });
    socket.on('DELETE_MESSAGE', (data: any) => {
      handleMessage(socket, clients, data, 'DELETE_MESSAGE');
    });

    socket.on('IS_TYPING', (data: any) => {
      handleTyping(socket, clients, io, data);
    });
  });
}
