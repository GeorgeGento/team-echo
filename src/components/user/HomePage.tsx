import React from 'react'
import HomeHeader from './HomeHeader'
import { redirect } from 'next/navigation';
import DisplayFriends from './friends/DisplayFriends';

type HomePageProps = {
    serverId: string;
    searchParams: {
        display: string;
        type: string;
    };
}

const availableDisplayPages = ["friends"];
const availableDisplayTypes = ["all", "blocked", "pending", "addFriend"];

export default async function HomePage({
    serverId, searchParams
}: HomePageProps) {
    if (!availableDisplayPages.includes(searchParams?.display) || !availableDisplayTypes.includes(searchParams?.type))
        return redirect(`/channels/${serverId}?${new URLSearchParams({ display: "friends", type: "all" }).toString()}`);

    const { display, type } = searchParams;

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <HomeHeader serverId={serverId} searchParams={searchParams} />

            {display === "friends" && (
                <DisplayFriends displayType={type} />
            )}
        </div>
    )
}
