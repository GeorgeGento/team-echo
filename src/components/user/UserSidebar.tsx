import React from 'react'
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User2 } from 'lucide-react';

import { currentProfile } from '@/lib/profile/clientSide';
import { getConversations } from '@/lib/conversation';
import { cn } from '@/lib/utils';

import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import SidebarFriend from './SidebarFriend';

type UserSidebarProps = {
    serverId: string;
    channelId?: string;
}

export default async function UserSidebar({
    serverId
}: UserSidebarProps) {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const conversations = await getConversations(profile?.id!);

    return (
        <div className='flex flex-col h-full w-full text-primary bg-zinc-300 dark:bg-[#2B2D31]'>
            <div className='h-12 text-md font-semibold px-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2'>
                Search Bar
            </div>

            <ScrollArea>
                <div className='pl-3 pr-2 mt-2 mb-5 flex flec-col w-full'>
                    <Link href={`/channels/${profile.id}?${new URLSearchParams({ display: "friends", type: "all" }).toString()}`}
                        className={cn(
                            'pl-3 p-2 w-full rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition',
                            'flex gap-x-2 items-center',
                            serverId === profile.id && 'bg-zinc-700/20 dark:bg-zinc-700'
                        )}
                    >
                        <User2 /> Friends
                    </Link>
                </div>

                {!!conversations?.length && (
                    <div className='mb-2 pl-3 pr-2'>
                        <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
                            Direct Messages
                        </p>

                        {conversations?.map((conversation) => (
                            <SidebarFriend key={conversation.id} user={profile}
                                friend={conversation.currentUserId === profile.id ? conversation.targetUser : conversation.currentUser} />
                        ))}
                    </div>
                )}
            </ScrollArea>

        </div>
    )
}