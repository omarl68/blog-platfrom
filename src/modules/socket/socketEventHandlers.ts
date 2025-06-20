import { Socket, Server } from 'socket.io';
import { Clients } from './socket';

export const handleConnect = (socket: Socket, clients: Clients, user: any) => {
  if (!user?._id) return;

  const userId = user._id.toString();
  let client = clients.find((c) => c._id === userId);

  if (!client) {
    clients.push({ _id: userId, socketIDs: [socket.id] });
  } else if (!client.socketIDs.includes(socket.id)) {
    client.socketIDs.push(socket.id);
  }

  console.log(`✅ User ${userId} connected with socket ${socket.id}`);
};

export const handleDisconnect = (socket: Socket, clients: Clients) => {
  clients.forEach((client, index) => {
    client.socketIDs = client.socketIDs.filter((id) => id !== socket.id);
    if (client.socketIDs.length === 0) {
      clients.splice(index, 1);
      socket.broadcast.emit('USER_DISCONNECTED', { userId: client._id });
    }
  });

  console.log(`🔴 Socket disconnected: ${socket.id}`);
};

export const handleJoinArticle = (socket: Socket, articleId: string) => {
  socket.join(articleId);
  console.log(`📥 Socket ${socket.id} joined article room ${articleId}`);
};

export const handleLeaveArticle = (socket: Socket, articleId: string) => {
  socket.leave(articleId);
  console.log(`📤 Socket ${socket.id} left article room ${articleId}`);
};

export const handleNewComment = (
  io: Server,
  data: { articleId: string; comment: any }
) => {
  if (!data?.articleId || !data?.comment) return;
  io.to(data.articleId).emit('NEW_COMMENT', data.comment);
  console.log(`💬 Broadcast comment to article ${data.articleId}`);
};
