import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/profile/clientSide"


export default async function SetupPage() {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  return redirect(`/channels/${profile.id}`);
}
