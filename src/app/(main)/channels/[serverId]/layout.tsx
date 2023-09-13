import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/clientSide"
import ServerSidebar from "@/components/server/ServerSidebar";
import UserSidebar from "@/components/user/UserSidebar";

export default async function ServerIdLayout({
    children, params: { serverId }
}: {
    children: React.ReactNode, params: { serverId: string }
}) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    if (serverId === profile.id) return (
        <div className="h-full">
            <div className="hidden md:flex flex-col h-full w-60 z-20 fixed inset-y-0">
                <UserSidebar serverId={serverId} />
            </div>

            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: { userId: profile.id }
            }
        }
    });

    if (!server) return redirect("/");

    return (
        <div className="h-full">
            <div className="hidden md:flex flex-col h-full w-60 z-20 fixed inset-y-0">
                <ServerSidebar serverId={serverId} />
            </div>

            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}
