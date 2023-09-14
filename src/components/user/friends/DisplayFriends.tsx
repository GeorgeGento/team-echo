import React from 'react'
import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/profile/clientSide';
import { getBlockedUsers, getFriends, getPendingFriendRequests } from '@/lib/profile/friends';
import AddFriend from './AddFriend';
import { ScrollArea } from '@/components/ui/scroll-area';
import DisplayUser from './DisplayUser';
import { X } from 'lucide-react';

type DisplayFriendsProps = {
  displayType: string;
}

const displayTypeMap = {
  all: "All Friends",
  pending: "Pending",
  blocked: "Blocked"
}

export default async function DisplayFriends({
  displayType
}: DisplayFriendsProps) {
  const user = await currentProfile();
  if (!user) return redirectToSignIn();

  if (displayType === "addFriend") return (
    <AddFriend serverId={user.id} />
  );

  let data;
  if (displayType === "all") data = await getFriends(user.id);
  else if (displayType === "pending") data = await getPendingFriendRequests(user.id);
  else if (displayType === "blocked") data = await getBlockedUsers(user.id);
  if (!data || !data.length) return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-y-2'>
      <X className='h-10 w-10' />

      <span>
        {displayType === "all" && "You have no friends..."}
        {displayType === "pending" && "You don't have pending friend requests."}
        {displayType === "blocked" && "You don't have anyone blocked."}
      </span>
    </div>
  );

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-[70%] p-2 rounded-md my-5 bg-zinc-500 dark:bg-zinc-900'>
        Search bar
      </div>

      <div className='w-full px-6'>
        <h2 className='mb-3'>{displayTypeMap[displayType as keyof typeof displayTypeMap]} - {data.length}</h2>

        <ScrollArea>
          {data.map(item => (
            <DisplayUser key={item.id} displayType={displayType} currentUser={user} item={item} />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
