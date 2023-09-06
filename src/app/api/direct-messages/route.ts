import { NextRequest, NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

import { currentProfile } from "@/lib/profile/serverSide";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(request: NextRequest) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(request.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        if (!conversationId) return NextResponse.json({ message: "Conversation ID missing" }, { status: 400 });

        let messages: DirectMessage[] = [];
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH, skip: 1,
                cursor: { id: cursor },
                where: { conversationId },
                include: {
                    member: { include: { profile: true } }
                },
                orderBy: { createdAt: "desc" }
            })
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: { conversationId },
                include: {
                    member: { include: { profile: true } }
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
        console.log("[DIRECT_MESSAGES_GET]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}