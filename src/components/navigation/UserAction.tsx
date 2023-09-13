"use client";

import React from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';

import ActionTooltip from '../ActionTooltip';

export default function UserAction({ user }: { user: User }) {
    return (
        <div>
            <ActionTooltip side='right' align='center' label='Direct Messages'>
                <Link href={`/channels/${user.id}`} className='group flex items-center'>
                    <div
                        className='flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px]
                    transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-blue-500'
                    >
                        <span className='text-black dark:text-white'>
                            TE
                        </span>
                    </div>
                </Link>
            </ActionTooltip>
        </div>
    )
}