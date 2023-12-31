import { NextRequest, NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export const maxDuration = 10;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!profile) return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        if (!channelId) return NextResponse.json({ message: "Channel ID missing" }, { status: 400 });

        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH, skip: 1,
                cursor: { id: cursor },
                where: { channelId: channelId },
                include: {
                    author: { include: { user: true } }
                },
                orderBy: { createdAt: "desc" }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: { channelId: channelId },
                include: {
                    author: { include: { user: true } }
                },
                orderBy: { createdAt: "desc" }
            });
        }

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages, nextCursor
        }, { status: 200 });
    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}