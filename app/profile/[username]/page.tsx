import Profile from "@/app/components/Profile";

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> | { username: string }
}) {
  const resolvedParams = await Promise.resolve(params);
  
  return <Profile username={resolvedParams.username} />;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> | { username: string }
}) {
  const resolvedParams = await Promise.resolve(params);
  
  return {
    title: `${resolvedParams.username} - Profile | GitTube`,
    description: `View ${resolvedParams.username}'s profile and videos on GitTube`,
  };
}