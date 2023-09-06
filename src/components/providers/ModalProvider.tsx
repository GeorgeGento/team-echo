"use client";

import React, { useEffect, useState } from 'react'

import CreateServerModal from '../modals/CreateServer';
import InviteModal from '../modals/Invite';
import EditServerModal from '../modals/EditServer';
import ManageMembersModal from '../modals/ManageMembers';
import CreateChannelModal from '../modals/CreateChannel';
import LeaveServerModal from '../modals/LeaveServer';
import DeleteServerModal from '../modals/DeleteServer';
import DeleteChannelModal from '../modals/DeleteChannel';
import EditChannelModal from '../modals/EditChannel';
import { MessageFileModal } from '../modals/MessageFileModal';
import DeleteMessageModal from '../modals/DeleteMessage';

function ModalProvider() {
    const [isMounted, setisMounted] = useState(false);

    useEffect(() => {
        setisMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <ManageMembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    )
}

export default ModalProvider