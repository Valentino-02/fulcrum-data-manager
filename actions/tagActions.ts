import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Tag name is required.",
  }),
  setIds: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type Set = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
  sets: Set[];
};

export async function getTags(): Promise<Tag[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tags")
    .select(`
      *,
      sets (*)
    `);

  if (error) {
    console.error("Error fetching tags with sets:", error);
    return [];
  }

  return data as Tag[];
}

export async function addTag(data: FormValues): Promise<void> {
  const supabase = createClient();

  const { data: tagData, error: tagError } = await supabase
    .from("tags")
    .insert({ name: data.name })
    .select();

  if (tagError) {
    console.error("Error inserting tag:", tagError);
    return;
  }

  if (!tagData || tagData.length === 0) {
    console.error("No tag data returned");
    return;
  }

  const tagId = tagData[0].id;

  if (data.setIds && data.setIds.length > 0) {
    const { error: setLinkError } = await supabase
      .from("sets_tags")
      .insert(
        data.setIds.map((setId) => ({
          tag_id: tagId,
          set_id: setId,
        }))
      );

    if (setLinkError) {
      console.error("Error linking sets to tag:", setLinkError);
      return;
    }
  }

  console.log("Tag and set links successfully inserted");
}

export async function updateTag(id: string, data: FormValues): Promise<void> {
  const supabase = createClient();

  const { error: tagError } = await supabase
    .from("tags")
    .update({ name: data.name })
    .match({ id });

  if (tagError) {
    console.error("Error updating tag:", tagError);
    return;
  }

  const { error: deleteError } = await supabase
    .from("sets_tags")
    .delete()
    .match({ tag_id: id });

  if (deleteError) {
    console.error("Error deleting old set links:", deleteError);
    return;
  }

  if (data.setIds && data.setIds.length > 0) {
    const { error: insertError } = await supabase
      .from("sets_tags")
      .insert(
        data.setIds.map((setId) => ({
          tag_id: id,
          set_id: setId,
        }))
      );

    if (insertError) {
      console.error("Error inserting new set links:", insertError);
      return;
    }
  }

  console.log("Tag and set links successfully updated");
}

export async function deleteTagById(id: string): Promise<void> {
  const supabase = createClient();

  const { error: deleteSetsError } = await supabase
    .from("sets_tags")
    .delete()
    .match({ tag_id: id });

  if (deleteSetsError) {
    console.error("Error deleting set links for tag:", deleteSetsError);
    return;
  }

  const { error: deleteTagError } = await supabase
    .from("tags")
    .delete()
    .match({ id });

  if (deleteTagError) {
    console.error("Error deleting tag:", deleteTagError);
    return;
  }

  console.log("Tag and set links successfully deleted");
}

export async function getTagById(id: string): Promise<FormValues | null> {
  const supabase = createClient();

  const { data: tagData, error: tagError } = await supabase
    .from("tags")
    .select("*, sets(*)")
    .eq("id", id)
    .single();

  if (tagError) {
    console.error("Error fetching tag:", tagError);
    return null;
  }

  if (!tagData) {
    console.error("No tag data found");
    return null;
  }

  return {
    name: tagData.name,
    setIds: tagData.sets.map((set: Set) => set.id),
  };
}
