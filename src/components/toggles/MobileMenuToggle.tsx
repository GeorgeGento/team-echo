import React from 'react'
import { Menu } from 'lucide-react'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/profile/clientSide'
import NavigationSidebar from '../navigation/NavigationSidebar'
import ServerSidebar from '../server/ServerSidebar'
import UserSidebar from '../user/UserSidebar'

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'

export default async function MobileMenuToggle({
    serverId
}: { serverId: string }) {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className='md:hidden'>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className='p-0 flex gap-0'>
                <div className='w-[72px]'>
                    <NavigationSidebar />
                </div>

                {serverId !== profile.id && (<ServerSidebar serverId={serverId} />)}
                {serverId === profile.id && (<UserSidebar serverId={serverId} />)}
            </SheetContent>
        </Sheet>
    )
}