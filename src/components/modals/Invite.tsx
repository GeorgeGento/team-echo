"use client"

import React, { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react';
import axios from 'axios';

import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';


function InviteModal() {
    const { isOpen, type, data: { server }, onOpen, onClose } = useModal();
    const isModalOpen = isOpen && type === "invite";
    const origin = useOrigin();
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000 * 3);
    }

    const onRenew = async () => {
        try {
            setIsLoading(true);

            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", { server: response.data });
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
                        Invite Friends!
                    </DialogTitle>
                </DialogHeader>

                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Server invite link
                    </Label>

                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input disabled={isLoading}
                            className='bg-zinc-300/50 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                            value={inviteUrl}
                        />

                        <Button size="icon" onClick={onCopy} disabled={isLoading}>
                            {copied ?
                                <Check className='h-4 w-4' /> :
                                <Copy className='h-4 w-4' />
                            }
                        </Button>
                    </div>

                    <Button variant="link" size="sm"
                        className='text-xs mt-4 text-zinc-500'
                        onClick={onRenew} disabled={isLoading}
                    >
                        Generate a new link
                        <RefreshCw className='h-4 w-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteModal