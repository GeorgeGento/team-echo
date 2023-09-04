import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";

export async function PATCH(request: NextRequest, { params: { memberId } }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!memberId) return NextResponse.json({ message: "Member ID is missing." }, { status: 400 });

        const { searchParams } = new URL(request.url);
        const { role } = await request.json();
        const serverId = searchParams.get("serverId");
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });

        const server = await db.server.update({
            where: { id: serverId, profileId: profile.id },
            data: {
                members: {
                    update: {
                        where: { id: memberId, profileId: { not: profile.id } },
                        data: { role }
                    }
                }
            },
            include: {
                members: {
                    include: { profile: true },
                    orderBy: { role: "asc" }
                }
            }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[MEMBER_ID_PATCH]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params: { memberId } }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!memberId) return NextResponse.json({ message: "Member ID is missing." }, { status: 400 });

        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });

        const server = await db.server.update({
            where: { id: serverId, profileId: profile.id },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: { not: profile.id }
                    }
                }
            },
            include: {
                members: {
                    include: { profile: true },
                    orderBy: { role: "asc" }
                }
            }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[MEMBER_ID_PATCH]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}