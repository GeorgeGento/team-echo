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

        return friends?.map(friend => {
            const {
                currentUser, targetUser, currentUserId, targetUserId,
                id, accepted, createdAt, updatedAt
            } = friend;
            if (friend.currentUserId === userId) return {
                id, accepted, createdAt, updatedAt,
                user: targetUser, userId: targetUserId
            }

            return {
                id, accepted, createdAt, updatedAt,
                user: currentUser, userId: currentUserId
            }
        });
    } catch (err) {
        return null;
    }
}

export const areFriends = async (currentUserId: string, targetUserId: string) => {
    try {
        const friendRequest = await db.friend.findFirst({
            where: {
                OR: [
                    { AND: [{ currentUserId }, { targetUserId }] },
                    { AND: [{ currentUserId: targetUserId }, { targetUserId: currentUserId }] }
                ]
            }
        });

        return friendRequest;
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

export const getPendingFriendRequests = async (userId: string) => {
    try {
        const friends = await db.friend.findMany({
            where: {
                OR: [
                    { AND: { currentUserId: userId, accepted: false } }, { AND: { targetUserId: userId, accepted: false } }
                ]
            },
            include: {
                currentUser: true, targetUser: true
            }
        });

        return friends?.map(friend => {
            const {
                currentUser, targetUser, currentUserId, targetUserId,
                id, accepted, createdAt, updatedAt
            } = friend;
            if (friend.currentUserId === userId) return {
                id, accepted, createdAt, updatedAt, initiator: true,
                user: targetUser, userId: targetUserId
            }

            return {
                id, accepted, createdAt, updatedAt, initiator: false,
                user: currentUser, userId: currentUserId
            }
        });
    } catch (err) {
        return null;
    }
}

export const getBlockedUsers = async (userId: string) => {
    try {
        const blockedUsers = await db.blockedUser.findMany({
            where: { currentUserId: userId },
            include: {
                targetUser: true
            }
        });

        return blockedUsers?.map(friend => {
            const {
                targetUser, targetUserId, id, createdAt, updatedAt
            } = friend;

            return {
                id, createdAt, updatedAt,
                user: targetUser, userId: targetUserId
            }
        });
    } catch (err) {
        return null;
    }
}

export const blockUser = async (currentUserId: string, targetUserId: string) => {
    try {
        const blockedUser = await db.blockedUser.create({
            data: {
                id: generateSnowflakeId(), currentUserId, targetUserId
            }
        });

        return blockedUser;
    } catch (err) {
        return null;
    }
}

export const UnblockUser = async (id: string, currentUserId: string, targetUserId: string) => {
    try {
        const unblockUser = await db.blockedUser.deleteMany({
            where: { id, currentUserId, targetUserId }
        });

        return unblockUser;
    } catch (err) {
        return null;
    }
}