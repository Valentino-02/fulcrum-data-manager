import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSets() {
  const supabase = createClient();
  let { data, error } = await supabase.from("sets").select("*");
  if (error) return []
  console.log(data)
  return data;
}


