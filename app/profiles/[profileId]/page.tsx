import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Twoja funkcja tworząca serwerowego klienta Supabase

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = {
  params: Promise<{ profileId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { profileId } = await params;

  // 1. Walidacja formatu UUID (chroni przed błędem bazy przy np. /profile/abc)
  if (!UUID_REGEX.test(profileId)) {
    notFound();
  }

  const supabase = await createClient();

  // 2. Pobranie profilu po UUID (kolumna `id` lub `user_id` - dopasuj do swojej tabeli)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, surname, biogram")
    .eq("id", profileId)
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-4">
        {profile.name} {profile.surname}
      </h1>
      <p>{profile.biogram}</p>
    </main>
  );
}
