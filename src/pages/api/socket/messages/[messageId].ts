import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfile } from "@/lib/profile/serverSidePages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";


export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "DELETE" && req.method !== "PATCH")
        return res.status(405).json({ message: "Method not allowed" });

    try {
        const profile = await currentProfile(req);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) return res.status(401).json({ message: "Unauthorized access" });
        if (!serverId) return res.status(400).json({ message: "Server ID is missing" });
        if (!channelId) return res.status(400).json({ message: "Channel ID is missing" });

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: { userId: profile.id }
                }
            },
            include: { members: true }
        });
        if (!server) return res.status(404).json({ message: "Server not found" });

        const channel = await db.channel.findFirst({
            where: { id: channelId as string, serverId: serverId as string }
        });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        const member = server.members.find(member => member.userId === profile.id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        let message = await db.message.findFirst({
            where: { id: messageId as string, channelId: channelId as string },
            include: { author: { include: { user: true } } }
        });
        if (!message || message.deleted) return res.status(404).json({ message: "Message not found" });

        const isMessageOwner = message.authorId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
        if (!canModify) return res.status(401).json({ message: "Unauthorized" });

        if (req.method === "DELETE") message = await db.message.update({
            where: { id: messageId as string },
            data: { fileUrl: null, deleted: true, content: "This message has been deleted." },
            include: { author: { include: { user: true } } }
        });

        if (req.method === "PATCH") {
            if (!isMessageOwner) return res.status(401).json({ message: "Unauthorized" });

            message = await db.message.update({
                where: { id: messageId as string },
                data: { content },
                include: { author: { include: { user: true } } }
            });
        }

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (err) {
        console.log("[MESSAGE_ID]", err);
        return res.status(500).json({ message: "Internal Error" });
    }
}