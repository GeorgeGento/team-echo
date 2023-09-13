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
        const { conversationId } = req.query;

        if (!profile) return res.status(401).json({ message: "Unauthorized access" });
        if (!conversationId) return res.status(400).json({ message: "Conversation ID is missing" });
        if (!content) return res.status(400).json({ message: "Message content is missing" });

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    { currentUser: { id: profile.id } },
                    { targetUser: { id: profile.id } },
                ]
            },
            include: {
                currentUser: true,
                targetUser: true
            }
        });
        if (!conversation) return res.status(404).json({ message: "Conversation not found" });

        const member = conversation.currentUser.id === profile.id ? conversation.currentUser : conversation.targetUser;
        if (!member) return res.status(404).json({ message: "Member not found" });

        const message = await db.directMessage.create({
            data: { id: generateSnowflakeId(), content, fileUrl, channelId: conversationId as string, authorId: member.id },
            include: { author: true }
        });

        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(201).json(message);
    } catch (err) {
        console.log("[DIRECT_MESSAGES_POST]", err);
        return res.status(500).json({ message: "Internal Error" });
    }
}