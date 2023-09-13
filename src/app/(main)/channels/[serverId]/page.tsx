import React from 'react'
import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/clientSide';

type ServerIdPageProps = {
    params: {
        serverId: string;
    }
}

async function ServerIdPage({
    params: { serverId }
}: ServerIdPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    if (serverId === profile.id) {
        return (
            <div>@ME</div>
        )
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: { some: { userId: profile.id } }
        },
        include: {
            channels: {
                where: { name: "general" },
                orderBy: { createdAt: "asc" }
            },
        }
    });

    const initialChannel = server?.channels[0];
    if (initialChannel?.name !== "general") return null;

    return redirect(`/channels/${serverId}/${initialChannel?.id}`);
}

export default ServerIdPage