import React from 'react'
import { Hash } from 'lucide-react'

import UserAvatar from '../UserAvatar';
import MobileMenuToggle from '../toggles/MobileMenuToggle';
import SocketIndicator from '../indicators/SocketIndicator';
import ChatVideoButton from './ChatVideoButton';

type ChatHeaderProps = {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

function ChatHeader({
    serverId, name, type, imageUrl
}: ChatHeaderProps) {
    return (
        <div className='h-12 text-md font-semibold px-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2'>
            <MobileMenuToggle serverId={serverId} />

            {type === "channel" && (
                <Hash className='h-5 w-5 mr-2 text-zinc-500 dark:text-zinc-400' />
            )}
            {type === "conversation" && (
                <UserAvatar src={imageUrl}
                    className='h-6 w-6 mr-2'
                />
            )}
            <p className='font-semibold text-md text-black dark:text-white'>
                {name}
            </p>

            <div className='ml-auto flex items-center'>
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}

export default ChatHeader