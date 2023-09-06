import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";
import { MemberRole } from "@prisma/client";

export async function PATCH(request: NextRequest, { params: { channelId } }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");
        const { name, type } = await request.json();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });
        if (!channelId) return NextResponse.json({ message: "Channel ID is missing." }, { status: 400 });
        if (name === "general") return NextResponse.json({ message: "Name cannot be 'general'" }, { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.MODERATOR, MemberRole.ADMIN] }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            NOT: { name: "general" }
                        },
                        data: { name, type }
                    }
                }
            }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[CHANNEL_ID_PATCH]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params: { channelId } }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);
        const serverId = searchParams.get("serverId");
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });
        if (!channelId) return NextResponse.json({ message: "Channel ID is missing." }, { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.MODERATOR, MemberRole.ADMIN] }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: { not: "general" }
                    }
                }
            }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}