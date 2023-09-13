import React from 'react'
import { redirect } from 'next/navigation';
import { ChannelType } from '@prisma/client';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/serverSide';
import { channelIconMap, roleIconMap } from '@/constants/icons';

import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

import ServerHeader from './ServerHeader';
import ServerSearch from './ServerSearch';
import ServerSection from './ServerSection';
import ServerChannel from './ServerChannel';
import ServerMember from './ServerMember';

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
                include: { user: true },
                orderBy: { role: "asc" }
            }
        }
    });
    if (!server) return redirect("/");

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.userId !== profile.id);
    const role = server.members.find(member => member.userId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full w-full text-primary bg-zinc-300 dark:bg-[#2B2D31]'>
            <ServerHeader server={server} role={role} />

            <ScrollArea className='px-3'>
                <div className='mt-2'>
                    <ServerSearch user={profile} data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.user.name,
                                icon: roleIconMap[member.role],
                            }))
                        },
                    ]}
                    />
                </div>
            </ScrollArea>
            <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />

            {!!textChannels?.length && (
                <div className='mb-2'>
                    <ServerSection sectionType="channels"
                        channelType={ChannelType.TEXT} role={role}
                        label='Text Channels'
                    />

                    {textChannels?.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                    ))}
                </div>
            )}

            {!!audioChannels?.length && (
                <div className='mb-2'>
                    <ServerSection sectionType="channels"
                        channelType={ChannelType.AUDIO} role={role}
                        label='Voice Channels'
                    />

                    {audioChannels?.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                    ))}
                </div>
            )}

            {!!videoChannels?.length && (
                <div className='mb-2'>
                    <ServerSection sectionType="channels"
                        channelType={ChannelType.VIDEO} role={role}
                        label='Video Channels'
                    />

                    {videoChannels?.map((channel) => (
                        <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                    ))}
                </div>
            )}

            {!!members?.length && (
                <div className='mb-2'>
                    <ServerSection sectionType="members" role={role}
                        label='Members' server={server}
                    />

                    {members?.map((member) => (
                        <ServerMember key={member.id} user={profile} member={member} server={server} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ServerSidebar