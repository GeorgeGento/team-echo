import { db } from "./db"
import { generateSnowflakeId } from "./generateSnowflakeId";

export const createConversation = async (currentUserId: string, targetUserId: string) => {
    let channel = await findConversation(currentUserId, targetUserId);

    if (!channel) channel = await createNewConversation(currentUserId, targetUserId);

    return channel;
}

export const getConversations = async (userId: string) => {
    try {
        return await db.conversation.findMany({
            where: {
                OR: [
                    { currentUserId: userId }, { targetUserId: userId }
                ]
            },
            include: {
                currentUser: true,
                targetUser: true
            }
        });
    } catch (err) {
        return null;
    }
}

const findConversation = async (currentUserId: string, targetUserId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                OR: [
                    { AND: [{ currentUserId }, { targetUserId }] },
                    { AND: [{ targetUserId }, { currentUserId }] },
                ]
            },
            include: {
                currentUser: true,
                targetUser: true
            }
        });
    } catch (err) {
        return null;
    }
}

const createNewConversation = async (currentUserId: string, targetUserId: string) => {
    try {
        return await db.conversation.create({
            data: { id: generateSnowflakeId(), currentUserId, targetUserId },
            include: {
                currentUser: true,
                targetUser: true
            }
        });
    } catch (err) {
        return null;
    }
}