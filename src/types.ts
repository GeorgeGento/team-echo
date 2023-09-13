import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server, Member, User } from "@prisma/client";

export type ServerWithMembers = Server & {
    members: (Member & { user: User })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: {
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}