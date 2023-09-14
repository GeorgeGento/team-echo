import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";

export async function PATCH(request: NextRequest, { params: { requestId } }: { params: { requestId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!requestId) return NextResponse.json({ message: "Request ID is missing." }, { status: 400 });

        const friendRequest = await db.friend.update({
            where: { id: requestId, targetUserId: profile.id },
            data: { accepted: true }
        });

        return NextResponse.json(friendRequest, { status: 200 });
    } catch (err) {
        console.log("[FRIEND_REQUEST_PATCH]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params: { requestId } }: { params: { requestId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!requestId) return NextResponse.json({ message: "Request ID is missing." }, { status: 400 });

        const friendRequest = await db.friend.delete({
            where: { id: requestId }
        });

        return NextResponse.json(friendRequest, { status: 200 });
    } catch (err) {
        console.log("[FRIEND_REQUEST_DELETE]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}