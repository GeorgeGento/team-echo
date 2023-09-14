import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";
import { areFriends, createFriendRequest } from "@/lib/profile/friends";


export async function POST(request: NextRequest) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");
        const { username } = await request.json();

        if (!profile) return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "User ID missing" }, { status: 400 });
        if (profile.id !== serverId) return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        if (!username) return NextResponse.json({ message: "User name missing" }, { status: 400 });

        const targetUser = await db.user.findFirst({
            where: { name: username }
        });
        if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const areTheyFriends = await areFriends(profile.id, targetUser.id);
        if (areTheyFriends) return NextResponse.json({ message: "Users are already friends" }, { status: 200 });

        const friendRequest = await createFriendRequest(profile.id, targetUser.id);

        return NextResponse.json(friendRequest, { status: 200 });
    } catch (error) {
        console.log("[FRIEND_REQUEST_POST]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}