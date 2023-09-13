import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";
import { generateSnowflakeId } from "@/lib/generateSnowflakeId";

export async function POST(request: NextRequest) {
    try {
        const { name, type } = await request.json();
        const user = await currentProfile();
        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");

        if (!user) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing" }, { status: 400 });
        if (name === "general") return NextResponse.json({ message: "Name cannot be 'general" }, { status: 400 });

        if (serverId !== user.id) {
            const server = await db.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: { userId: user.id, role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } }
                    }
                },
                data: {
                    channels: { create: { id: generateSnowflakeId(), name, type } }
                }
            });

            return NextResponse.json(server, { status: 201 });
        }

        return NextResponse.json({ message: "Bad request" }, { status: 400 });
    } catch (err) {
        console.log("[CHANNEL_POST]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}