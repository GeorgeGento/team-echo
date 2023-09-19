"use client"

import { SignInButton } from '@clerk/nextjs'
import React from 'react'

export default function HomePage() {
    return (
        <div className='h-screen w-full flex flex-col items-center justify-center gap-y-5'>
            <div className='h-[20em] w-[20em] md:h-[30em] md:w-[30em]'>
                <div className='h-full w-full flex flex-col gap-y-4 items-center justify-center
                bg-gradient-to-r from-sky-600/40 via-purple-600/40 to-rose-600/40 rounded-3xl'
                >
                    <h1 className='text-xl'>
                        TeamEcho
                    </h1>

                    <div className='p-2'>
                        <p>
                        TeamEcho is the cutting-edge chat application that is set to transform the way teams collaborate and communicate. With a sleek and intuitive interface, TeamEcho provides a seamless experience for users across various industries and purposes.
                        </p>
                    </div>

                    <SignInButton mode='modal'>
                        <button className='bg-blue-800 hover:bg-blue-700 transition p-2 rounded-md'>
                             Sign in with cleck
                        </button>
                    </SignInButton>
                </div>
            </div>
        </div>
    )
}