"use client";

import React from 'react'
import { MemberRole } from '@prisma/client';

import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
    ChevronDown, LogOut, PlusCircle,
    Settings, Trash, UserPlus, Users
} from 'lucide-react';
import { ServerWithMembers } from '@/types';
import { useModal } from '@/hooks/useModalStore';

type ServerHeaderProps = {
    server: ServerWithMembers;
    role?: MemberRole;
}

function ServerHeader({
    server, role
}: ServerHeaderProps) {
    const { onOpen } = useModal();
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button className='h-12 w-full text-md font-semibold px-3 flex items-center 
                border-neutral-200 dark:border-neutral-800 border-b-2 
                hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto' />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
                {isModerator && (
                    <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
                        onClick={() => onOpen("invite", { server })}>
                        Invite People
                        <UserPlus className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("editServer", { server })}
                        className='px-3 py-2 text-sm cursor-pointer'
                    >
                        Server Settings
                        <Settings className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("manageMembers", { server })}
                        className='px-3 py-2 text-sm cursor-pointer'
                    >
                        Manage Members
                        <Users className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuItem onClick={() => onOpen("createChannel", { server })}
                        className='px-3 py-2 text-sm cursor-pointer'
                    >
                        Create Channel
                        <PlusCircle className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuSeparator />
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("deleteServer", { server })}
                        className='px-3 py-2 text-sm cursor-pointer text-rose-500'
                    >
                        Delete Server
                        <Trash className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("leaveServer", { server })}
                        className='px-3 py-2 text-sm cursor-pointer text-rose-500'
                    >
                        Leave Server
                        <LogOut className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ServerHeader