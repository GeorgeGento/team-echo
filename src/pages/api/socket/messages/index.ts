import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfile } from "@/lib/profile/serverSidePages";
import { db } from "@/lib/db";
import { generateSnowflakeId } from "@/lib/generateSnowflakeId";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const profile = await currentProfile(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) return res.status(401).json({ message: "Unauthorized access" });
        if (!serverId) return res.status(400).json({ message: "Server ID is missing" });
        if (!channelId) return res.status(400).json({ message: "Channel ID is missing" });
        if (!content) return res.status(400).json({ message: "Message content is missing" });

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

        const message = await db.message.create({
            data: { id: generateSnowflakeId(), content, fileUrl, channelId: channel.id, authorId: member.id },
            include: { author: { include: { user: true } } }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(201).json(message);
    } catch (err) {
        console.log("[MESSAGES_POST]", err);
        return res.status(500).json({ message: "Internal Error" });
    }
}