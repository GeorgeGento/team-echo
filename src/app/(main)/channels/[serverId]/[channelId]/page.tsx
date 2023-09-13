import React from 'react'
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile/clientSide';
import { createConversation } from '@/lib/conversation';

import ChatHeader from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import MediaRoom from '@/components/MediaRoom';
import { ChannelType } from '@prisma/client';

type ChannelIdPageProps = {
    params: {
        serverId: string;
        channelId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

export default async function ChannelIdPage({
    params: { serverId, channelId }, searchParams: { video }
}: ChannelIdPageProps) {
    const user = await currentProfile();
    if (!user) return redirectToSignIn();

    if (serverId === user.id) {
        const conversation = await createConversation(user.id, channelId);
        if (!conversation) return redirect(`/channels/${serverId}`);

        const { currentUser, targetUser } = conversation;
        const otherMember = currentUser.id === user.id ? currentUser : targetUser;

        return (
            <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
                <ChatHeader name={otherMember.name}
                    serverId={serverId} type='conversation'
                    imageUrl={otherMember.imageUrl}
                />

                {video && (
                    <MediaRoom chatId={conversation.id} video audio />
                )}

                {!video && (
                    <>
                        <ChatMessages
                            user={user}
                            name={otherMember.name}
                            chatId={conversation.id}
                            type="conversation"
                            apiUrl="/api/direct-messages"
                            paramKey="conversationId"
                            paramValue={conversation.id}
                            socketUrl="/api/socket/direct-messages"
                            socketQuery={{
                                conversationId: conversation.id,
                            }}
                        />
                        <ChatInput
                            name={otherMember.name}
                            type="conversation"
                            apiUrl="/api/socket/direct-messages"
                            query={{
                                conversationId: conversation.id,
                            }}
                        />
                    </>
                )}
            </div>
        )
    }

    const channel = await db.channel.findUnique({
        where: { id: channelId }
    });
    const member = await db.member.findFirst({
        where: { serverId, userId: user.id }
    });

    if (!channel || !member) return redirect("/");

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader serverId={serverId} name={channel.name} type='channel' />

            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />

                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channelId} video={false} audio={true} />
            )}

            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channelId} video={true} audio={false} />
            )}
        </div>
    )
}