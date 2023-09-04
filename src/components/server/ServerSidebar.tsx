import React from 'react'
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/serverSide';
import { ChannelType } from '@prisma/client';
import ServerHeader from './ServerHeader';

type ServerSidebarProps = {
    serverId: string;
}
async function ServerSidebar({
    serverId
}: ServerSidebarProps) {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const server = await db.server.findUnique({
        where: { id: serverId },
        include: {
            channels: {
                orderBy: { createdAt: "asc" }
            },
            members: {
                include: { profile: true },
                orderBy: { role: "asc" }
            }
        }
    });
    if (!server) return redirect("/");

    const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT);
    const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO);
    const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO);
    const members = server.members.filter(member => member.profileId !== profile.id);
    const role = server.members.find(member => member.profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full w-full text-primary bg-zinc-400 dark:bg-[#2B2D31]'>
            <ServerHeader server={server} role={role} />
        </div>
    )
}

export default ServerSidebar