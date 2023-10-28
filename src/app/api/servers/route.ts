import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { generateSnowflakeId } from "@/lib/generateSnowflakeId";

export async function POST(request: NextRequest) {
    try {
        const { name, imageUrl } = await request.json();
        const profile = await currentProfile();

        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });

        const server = await db.server.create({
            data: {
                id: generateSnowflakeId(),
                ownerId: profile.id,
                name, imageUrl,
                inviteCode: generateSnowflakeId(),
                channels: {
                    create: [
                        { id: generateSnowflakeId(), name: "general" }
                    ]
                },
                members: {
                    create: [
                        { id: generateSnowflakeId(), userId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server, { status: 201 });
    } catch (err) {
        console.log("[SERVER_POST]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}