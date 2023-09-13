import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { db } from "../db";

export const currentProfile = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);
    if (!userId) return null;

    const profile = await db.user.findUnique({
        where: { userId },
    });

    return profile;
}