import { db } from "../db";
import { generateSnowflakeId } from "../generateSnowflakeId";

export const getFriends = async (userId: string) => {
    try {
        const friends = await db.friend.findMany({
            where: {
                OR: [
                    { AND: { currentUserId: userId, accepted: true } }, { AND: { targetUserId: userId, accepted: true } }
                ]
            },
            include: {
                currentUser: true, targetUser: true
            }
        });

        return friends?.map(friend => friend.currentUserId === userId ? friend.targetUser : friend.currentUser);
    } catch (err) {
        return null;
    }
}

export const createFriendRequest = async (currentUserId: string, targetUserId: string) => {
    try {
        const friendRequest = await db.friend.create({
            data: {
                id: generateSnowflakeId(), currentUserId, targetUserId
            }
        });

        return friendRequest;
    } catch (err) {
        return null;
    }
}

export const acceptFriendRequest = async (id: string, currentUserId: string, targetUserId: string) => {
    try {
        const friendRequest = await db.friend.update({
            where: { id, currentUserId, targetUserId },
            data: {
                accepted: true
            }
        });

        return friendRequest;
    } catch (err) {
        return null;
    }
}

export const declineFriendRequest = async (id: string, currentUserId: string, targetUserId: string) => {
    try {
        const friendRequest = await db.friend.deleteMany({
            where: { id, currentUserId, targetUserId }
        });

        return friendRequest;
    } catch (err) {
        return null;
    }
}