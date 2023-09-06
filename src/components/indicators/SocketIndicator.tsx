"use client"

import React from 'react'
import { useSocket } from '../providers/SocketProvider'
import { Badge } from '../ui/badge';
import ActionTooltip from '../ActionTooltip';

function SocketIndicator() {
    const { isConnected } = useSocket();

    if (!isConnected) return (
        <ActionTooltip side='bottom' align='center' label='Fallback: Polling every 1s'>
            <div className='h-full w-full'>
                <Badge variant="outline" className='bg-yellow-600 text-white border-none'>
                    <p className='h-4 w-2 text-2xl flex items-center justify-center hover:cursor-pointer'>
                        •
                    </p>
                </Badge>
            </div>
        </ActionTooltip>
    );

    return (
        <ActionTooltip side='bottom' align='center' label='Live'>
            <div className='h-full w-full'>
                <Badge variant="outline" className='bg-emerald-600 text-white border-none'>
                    <p className='h-4 w-2 text-2xl flex items-center justify-center hover:cursor-pointer'>
                        •
                    </p>
                </Badge >
            </div>
        </ActionTooltip>
    );
}

export default SocketIndicator