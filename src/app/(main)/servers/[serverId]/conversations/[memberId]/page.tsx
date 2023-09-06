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

type MemberIdPageProps = {
  params: {
    serverId: string;
    memberId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

async function MemberIdPage({
  params: { serverId, memberId }, searchParams: { video }
}: MemberIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: { serverId, profileId: profile.id },
    include: { profile: true }
  });
  if (!currentMember) return redirect("/");

  const conversation = await createConversation(currentMember.id, memberId);
  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={otherMember.profile.name}
        serverId={serverId} type='conversation'
        imageUrl={otherMember.profile.imageUrl}
      />

      {video && (
        <MediaRoom chatId={conversation.id} video audio />
      )}

      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
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
            name={otherMember.profile.name}
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

export default MemberIdPage