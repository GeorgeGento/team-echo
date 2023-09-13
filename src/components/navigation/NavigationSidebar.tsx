import React from 'react';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

import { currentProfile } from '@/lib/profile/serverSide';
import { db } from '@/lib/db';

import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

import NavigationAction from './NavigationAction';
import NavigationItem from './NavigationItem';
import { ToggleThemeMode } from '../toggles/ToggleTheme';
import UserAction from './UserAction';


async function NavigationSidebar() {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: {
                some: { userId: profile.id }
            }
        }
    })

    return (
        <div className='space-y-4 flex flex-col items-center h-full w-full text-primary bg-[#E3E5E8] dark:bg-[#1E1F22] py-3'>
            <UserAction user={profile} />
            <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />

            <ScrollArea className='flex-1 w-full'>
                {servers.map(server => (
                    <div key={server.id} className='mb-4'>
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
                <NavigationAction />
            </ScrollArea>

            <div className='pb-3 mt-auto flex flex-col items-center gap-y-4'>
                <ToggleThemeMode />
                <UserButton afterSignOutUrl='/' appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]"
                    }
                }} />
            </div>
        </div>
    )
}

export default NavigationSidebar