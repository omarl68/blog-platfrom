import { Socket } from "socket.io";
import { Clients } from "./socket";
export const handleDisconnect = (socket: Socket, clients: Clients) => {
    let disconnectClient = clients.find((client) =>
        client.socketID.includes(socket.id)
    );
    if (disconnectClient) {
        disconnectClient.socketID = disconnectClient.socketID.filter(
            (id) => id !== socket.id
        );
        if (disconnectClient.socketID.length === 0) {
            socket.broadcast.emit("USER_DISCONNECTED", {
                user: disconnectClient
            });
        }
    }
};
export const handleConnect = (socket: Socket, clients: Clients, data: any) => {
    if (
        data
    ) {
        const clientCheck = clients.find(
            (client: any) =>
                (client?._id?.toString() == data?.user?._id?.toString())
        );
        if (!clientCheck) {
            clients.push({
                ...data?.user,
                socketID: [socket.id],
            });
        }
        if (
            clientCheck &&
            !clientCheck.socketID.includes(socket.id)
        ) {
            clientCheck.socketID.push(socket.id);
        }

        console.log('user connected:', clients)
    }

};
export const handleMessageFromClient = (socket: Socket, io: any, data: any, clients: any) => {
    if (data?.userID) {
        const user = clients.find((user: any) => user._id?.toString() == data?.userID?.toString());
        if (user) {
            socket.to(user?.socketID).emit("NEW_MESSAGE", data);
        }
    }
};
export const handleMessage = (
    socket: Socket,
    clients: Clients,
    data: any,
    emitMessage: string
) => {
    const receiver: any = clients.find(
        (client) =>
        ((client?.conversationId !== undefined &&
            client?.conversationId === data?.lastMessage?.conversation) ||
            (client?.conversationId?._id !== undefined &&
                client?.conversationId?._id === data?.lastMessage?.conversation))
    );
    if (receiver) {
        receiver.socketID.forEach((socketID: any) => {
            socket.to(socketID).emit(emitMessage, data);
        });
    }
    socket.to(receiver?.socketID).emit(emitMessage, data);

};
export const handleTyping = (
    socket: Socket,
    clients: any,
    io: any,
    data: any
) => {
    if (data?.userID) {
        const user = clients.find((user: any) => user._id == data?.userID);
        if (user) {
            socket.to(data?.userID).emit("IS_TYPING_FROM_CLIENT", data);
        }
    }

};
export const handleSeenFromClient = (
    socket: Socket,
    data: any,
    clients: Clients
) => {
    if (data) {
        const admins = clients?.filter((el: any) => el?.role == 'admin');
        admins.forEach((el: any) => {
            el?.socketID?.forEach((id: any) => socket.to(id).emit('SEEN_FROM_CLIENT', data))
        })
    }
};

export const handleSeenMessage = (
    socket: Socket,
    data: any,
    clients: Clients
) => {
    if (data.message) {
        const client = clients?.find((user: any) => user?._id == data?.userID);
        if (client) {
            client.socketID.forEach((id) => {
                socket.to(id).emit("SEEN_FROM_ADMIN", data?.message);
            });
        }
    }
};
