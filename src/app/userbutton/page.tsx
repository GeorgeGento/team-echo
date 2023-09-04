import { UserButton } from '@clerk/nextjs'
import React from 'react'

function page() {
    return (
        <UserButton afterSignOutUrl='/' />
    )
}

export default page