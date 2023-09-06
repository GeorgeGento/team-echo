import React from 'react'
import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/profile/clientSide';
import { db } from '@/lib/db';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { ChannelType } from '@prisma/client';
import { ChatMessages } from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/MediaRoom';

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  }
}

async function ChannelIdPage({
  params: { serverId, channelId }
}: ChannelIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: { id: channelId }
  });
  const member = await db.member.findFirst({
    where: { serverId, profileId: profile.id }
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

export default ChannelIdPage