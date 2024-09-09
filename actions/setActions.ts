import { createClient } from "@/utils/supabase/server";

export async function getSets() {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("sets")
    .select(`
      *,
      aspects (*),
      tags (*)
    `)
  if (error) {
    console.error("Error fetching sets with aspects:", error);
    return [];
  }
  return data;
}


