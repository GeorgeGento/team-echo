"use client"

import React from 'react'
import { Member, Profile, Server } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import UserAvatar from '../UserAvatar';
import { roleIconMap } from '@/constants/icons';

type ServerMemberProps = {
    member: Member & { profile: Profile };
    server: Server;
}

function ServerMember({ member, server }: ServerMemberProps) {
    const router = useRouter();
    const params = useParams();
    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    );
}

export default ServerMember