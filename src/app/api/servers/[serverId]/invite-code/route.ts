import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";

export async function PATCH(request: NextRequest, { params: { serverId } }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });

        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });

        const server = await db.server.update({
            where: { id: serverId, profileId: profile.id },
            data: { inviteCode: uuidv4() }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[SERVER_ID_INVITE_CODE]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}