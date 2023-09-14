"use client"

import axios from 'axios';
import React from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, MessageCircle, MoreVertical, UserX2, X } from 'lucide-react';
import { User } from '@prisma/client';

import UserAvatar from '../UserAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import ActionTooltip from '@/components/ActionTooltip';

type DisplayUserProps = {
    displayType: string;
    currentUser: User;
    item: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        initiator?: boolean;
        user: {
            id: string;
            userId: string;
            name: string;
            imageUrl: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
        userId: string;
    }
}

export default function DisplayUser({
    item, displayType, currentUser
}: DisplayUserProps) {
    const router = useRouter();
    const pending = {
        accept: async (requestId: string) => {
            try {
                await axios.patch(`/api/users/friendRequest/${requestId}`);
                router.refresh();
            } catch (err) {
                console.log(err);
            }
        },
        reject: async (requestId: string) => {
            try {
                await axios.delete(`/api/users/friendRequest/${requestId}`);
                router.refresh();
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            <Separator className='bg-zinc-400' />
            <div key={item.id}
                className='w-full p-2 flex items-center justify-between hover:bg-zinc-400 dark:hover:bg-zinc-600 transition
              rounded-md'
            >
                <div className='flex items-center gap-x-3'>
                    <UserAvatar src={item.user.imageUrl} />
                    <span>{item.user.name}</span>
                </div>

                {displayType === "pending" && !item.initiator && (
                    <div className='flex items-center gap-x-5'>
                        <ActionTooltip side='top' label='Accept'>
                            <button onClick={() => pending.accept(item.id)}
                                className='p-1 rounded-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-800 dark:hover:bg-emerald-600
                            dark:hover:text-black'
                            >
                                <Check className='h-6 w-6 text-white dark:text-black' />
                            </button>
                        </ActionTooltip>

                        <ActionTooltip side='top' label='Reject'>
                            <button onClick={() => pending.reject(item.id)}
                                className='p-1 rounded-full bg-rose-600 hover:bg-rose-500 dark:bg-rose-800 dark:hover:bg-rose-600
                            dark:hover:text-black'
                            >
                                <X className='h-6 w-6 text-white dark:text-black' />
                            </button>
                        </ActionTooltip>
                    </div>
                )}

                {displayType === "pending" && item.initiator && (
                    <span>Pending approval...</span>
                )}

                {displayType === "all" && (
                    <div className='flex items-center gap-x-5'>
                        <ActionTooltip side='top' label='Chat'>
                            <Link href={`/channels/${currentUser.id}/${item.userId}`}
                                className='p-2 rounded-full bg-zinc-600 hover:bg-zinc-500 dark:bg-black dark:hover:bg-zinc-800'
                            >
                                <MessageCircle className='h-6 w-6 text-white dark:text-zinc-500' />
                            </Link>
                        </ActionTooltip>

                        <ActionTooltip side='top' label='More'>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='p-2 rounded-full bg-zinc-600 hover:bg-zinc-500 dark:bg-black dark:hover:bg-zinc-800'>
                                    <MoreVertical className='h-6 w-6 text-white dark:text-zinc-500' />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent side='left'>
                                    <DropdownMenuItem onClick={() => pending.reject(item.id)}>
                                        Unfriend
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ActionTooltip>
                    </div>
                )}

                {displayType === "blocked" && (
                    <div className='flex items-center gap-x-5'>
                        <ActionTooltip side='top' label='Unblock'>
                            <button onClick={() => pending.accept(item.id)}
                                className='p-2 rounded-full bg-zinc-600 hover:bg-zinc-500 dark:bg-black dark:hover:bg-zinc-800'
                            >
                                <UserX2 className='h-6 w-6 text-white dark:text-zinc-500' />
                            </button>
                        </ActionTooltip>
                    </div>
                )}
            </div>
        </>
    )
}