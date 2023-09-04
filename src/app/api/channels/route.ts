import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const { name, type } = await request.json();
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");

        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing" }, { status: 400 });
        if (name === "general") return NextResponse.json({ message: "Name cannot be 'general" }, { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name, type
                    }
                }
            }
        });

        return NextResponse.json(server, { status: 201 });
    } catch (err) {
        console.log("[SERVER_POST]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}