"use client"

import React from 'react'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { User } from '@prisma/client'

import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';

type FriendProps = {
    user: User;
    friend: User;
}

export default function SidebarFriend({ friend, user }: FriendProps) {
    const params = useParams();

    return (
        <Link href={`/channels/${user.id}/${friend.id}`}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === friend.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={friend.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.channelId === friend.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {friend.name}
            </p>
        </Link>
    );
}