import { NextRequest, NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/serverSide";

export async function PATCH(request: NextRequest, { params: { serverId } }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });

        const { name, imageUrl } = await request.json();

        const server = await db.server.update({
            where: { id: serverId, ownerId: profile.id },
            data: { name, imageUrl }
        });

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[SERVER_ID_PATCH]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params: { serverId } }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ message: "Unauthorized Access" }, { status: 401 });
        if (!serverId) return NextResponse.json({ message: "Server ID is missing." }, { status: 400 });

        const server = await db.server.delete({
            where: { id: serverId, ownerId: profile.id }
        });

        const fileNameArray = server.imageUrl.split("/");
        await utapi.deleteFiles(fileNameArray[fileNameArray.length - 1]);

        return NextResponse.json(server, { status: 200 });
    } catch (err) {
        console.log("[SERVER_ID_DELETE]", err);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}