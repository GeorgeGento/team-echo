import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile/clientSide"
import InitialModal from "@/components/modals/InitialModal";


export default async function SetupPage() {
  const profile = await currentProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />
}
