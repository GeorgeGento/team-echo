import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "../db";
import { generateSnowflakeId } from "../generateSnowflakeId";

export const currentProfile = async () => {
    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const profile = await db.user.findUnique({
        where: { userId: user.id }
    });

    if (profile) return profile;

    const newProfile = await db.user.create({
        data: {
            id: generateSnowflakeId(),
            userId: user.id,
            name: `${user.username}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });

    return newProfile;
}