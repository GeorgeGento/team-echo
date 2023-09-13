import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/serverSide';

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
                some: { userId: profile.id }
            }
        },
        include: {
            channels: { where: { name: "general" } }
        }
    });
    if (existingServer) return redirect(`/channels/${existingServer.id}/${existingServer.channels[0]}`);

    const server = await db.server.update({
        where: { inviteCode },
        data: {
            members: {
                create: [{ userId: profile.id }]
            }
        },
        include: {
            channels: { where: { name: "general" } }
        }
    })

    if (server) return redirect(`/channels/${server.id}/${server.channels[0]}`);

    return null;
}

export default InvitePage