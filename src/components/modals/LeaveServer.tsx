"use client"

import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';

import { useModal } from '@/hooks/useModalStore';

function LeaveServerModal() {
    const { isOpen, type, data: { server }, onOpen, onClose } = useModal();
    const isModalOpen = isOpen && type === "leaveServer";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onConfirm = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);

            onClose();
            router.refresh();
            router.push("/");
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Leave Server
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to leave <span className='font-semibold text-indigo-500'>{server?.name}</span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button variant="ghost" disabled={isLoading} onClick={onClose}>
                            Cancel
                        </Button>

                        <Button variant="primary" disabled={isLoading} onClick={onConfirm}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LeaveServerModal