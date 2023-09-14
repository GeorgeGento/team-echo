import React from 'react'
import MobileMenuToggle from '../toggles/MobileMenuToggle';
import HomeHeaderFriends from './friends/HomeHeaderFriends';

type HomeHeaderProps = {
    serverId: string;
    searchParams: {
        display: string;
        type: string;
    }
}

export default function HomeHeader({
    serverId, searchParams
}: HomeHeaderProps) {
    return (
        <div className='h-12 text-md font-semibold px-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2'>
            <MobileMenuToggle serverId={serverId} />

            {searchParams?.display === "friends" && (
                <HomeHeaderFriends serverId={serverId} searchParams={searchParams} />
            )}
        </div>
    )
}