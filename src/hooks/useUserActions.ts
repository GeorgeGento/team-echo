import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

type Data = {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

type FriendsType = "all" | "pending" | "blocked" | "addFriend";

type UserActions = {
    showMemberList: boolean;
    toggleMemberList: (toggle: boolean) => void;
    home: {
        displayFriends: boolean;
        friendType: FriendsType
    };
    setDisplayFriends: (toogle: boolean) => void;
    setDisplayFriendType: (type: FriendsType) => void;
    data: Data;
}

export const useUserActions = create<UserActions>((set) => ({
    showMemberList: true,
    toggleMemberList: (toggle) => set({ showMemberList: toggle }),
    home: {
        displayFriends: true,
        friendType: "all"
    },
    setDisplayFriends: (toggle: boolean) => set({ home: { displayFriends: toggle, friendType: "all" } }),
    setDisplayFriendType: (type) => set({ home: { displayFriends: true, friendType: type } }),
    data: {}
}));