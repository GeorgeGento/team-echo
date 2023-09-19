import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";

export async function DELETE(request: NextRequest, { params: { requestId } }: { params: { requestId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!requestId) return NextResponse.json({ message: "Request ID is missing." }, { status: 400 });

        const deletedBlock = await db.blockedUser.delete({
            where: { id: requestId }
        });

        return NextResponse.json(deletedBlock, { status: 200 });
    } catch (err) {
        console.log("[BLOCK_DELETE]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}