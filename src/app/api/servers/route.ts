import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const { name, imageUrl } = await request.json();
        const profile = await currentProfile();

        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name, imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
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