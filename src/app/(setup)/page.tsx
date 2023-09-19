import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/profile/clientSide"
import HomePage from "@/components/homePage"


export default async function SetupPage() {
  const profile = await currentProfile();

  if (!profile) return (
    <div>
      <HomePage />
    </div>
  );

  return redirect(`/channels/${profile.id}?${new URLSearchParams({ display: "friends", type: "all" }).toString()}`);
}
