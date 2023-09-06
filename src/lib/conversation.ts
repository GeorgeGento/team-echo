import { db } from "./db"

export const createConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId);

    if (!conversation) conversation = await createNewConversation(memberOneId, memberTwoId);

    return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                OR: [
                    { AND: [{ memberOneId }, { memberTwoId }] },
                    { AND: [{ memberTwoId }, { memberOneId }] }
                ]
            },
            include: {
                memberOne: { include: { profile: true } },
                memberTwo: { include: { profile: true } }
            }
        });
    } catch (err) {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: { memberOneId, memberTwoId },
            include: {
                memberOne: { include: { profile: true } },
                memberTwo: { include: { profile: true } }
            }
        });
    } catch (err) {
        return null;
    }
}