import React from 'react'
import { User2 } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Separator } from '../../ui/separator';

type HomeHeaderFriendsProps = {
    serverId: string;
    searchParams: {
        display: string;
        type: string;
    }
}

export default function HomeHeaderFriends({
    serverId, searchParams: { display, type }
}: HomeHeaderFriendsProps) {
    return (<>
        <div className='flex gap-x-2 mr-3 items-center justify-center'>
            <User2 /> Friends
        </div>
        <Separator orientation="vertical" />

        <div className='flex items-center gap-x-3 ml-3'>
            <Link href={`/channels/${serverId}?${new URLSearchParams({ display: "friends", type: "all" }).toString()}`}
                className={cn(
                    'hover:bg-zinc-400 dark:hover:bg-zinc-500 transition rounded-md p-1',
                    type === "all" && 'bg-zinc-500 dark:bg-zinc-600'
                )}
            >
                All
            </Link>

            <Link href={`/channels/${serverId}?${new URLSearchParams({ display: "friends", type: "pending" }).toString()}`}
                className={cn(
                    'hover:bg-zinc-400 dark:hover:bg-zinc-500 transition rounded-md p-1',
                    type === "pending" && 'bg-zinc-500 dark:bg-zinc-600'
                )}
            >
                Pending
            </Link>

            <Link href={`/channels/${serverId}?${new URLSearchParams({ display: "friends", type: "blocked" }).toString()}`}
                className={cn(
                    'hover:bg-zinc-400 dark:hover:bg-zinc-500 transition rounded-md p-1',
                    type === "blocked" && 'bg-zinc-500 dark:bg-zinc-600'
                )}
            >
                Blocked
            </Link>

            <Link href={`/channels/${serverId}?${new URLSearchParams({ display: "friends", type: "addFriend" }).toString()}`}
                className={cn(
                    'bg-emerald-600 rounded-md p-1 hover:bg-emerald-500 transition',
                    type === "addFriend" && 'text-emerald-700 bg-transparent'
                )}
            >
                Add Friend
            </Link>
        </div>
    </>);
}