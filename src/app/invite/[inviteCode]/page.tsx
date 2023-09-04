import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/serverSide';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

type InvitePageProps = {
    params: {
        inviteCode: string;
    }
}

async function InvitePage({ params: { inviteCode } }: InvitePageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    if (!inviteCode) return redirect("/");

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: { profileId: profile.id }
            }
        }
    });
    if (existingServer) return redirect(`/servers/${existingServer.id}`);

    const server = await db.server.update({
        where: { inviteCode },
        data: {
            members: {
                create: [{ profileId: profile.id }]
            }
        }
    })

    if (server) return redirect(`/servers/${server.id}`);

    return null;
}

export default InvitePage