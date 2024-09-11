import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Set name is required.",
  }),
  aspects: z.array(
    z.object({
      name: z.string().min(1, {
        message: "Aspect name is required.",
      }),
      values: z
        .array(z.string())
        .min(2, { message: "There must be at least 2 values." })
        .max(10, { message: "There cannot be more than 10 values." }),
    })
  ),
});

export type FormValues = z.infer<typeof formSchema>;

// Define additional types for tags
type Tag = {
  name: string;
};

// Define the Set type using FormValues
type Set = FormValues & {
  id: string;
  tags: Tag[];
};

export async function getSets(): Promise<Set[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sets")
    .select(`
      *,
      aspects (*),
      tags (*)
    `);

  if (error) {
    console.error("Error fetching sets with aspects:", error);
    return [];
  }

  return data as Set[];
}

export async function addSet(data: FormValues): Promise<void> {
  const supabase = createClient();

  const { data: setData, error: setError } = await supabase
    .from("sets")
    .insert({ name: data.name })
    .select();

  if (setError) {
    console.error("Error inserting set:", setError);
    return;
  }
  if (!setData || setData.length === 0) {
    console.error("No set data returned");
    return;
  }

  const setId = setData[0].id;

  const { error: aspectsError } = await supabase
    .from("aspects")
    .insert(
      data.aspects.map(aspect => ({
        ...aspect,
        set_id: setId,
      }))
    );

  if (aspectsError) {
    console.error("Error inserting aspects:", aspectsError);
    return;
  }

  console.log("Set and aspects successfully inserted");
}

export async function updateSet(id: string, data: FormValues): Promise<void> {
  const supabase = createClient();

  const { error: setError } = await supabase
    .from("sets")
    .update({ name: data.name })
    .match({ id });

  if (setError) {
    console.error("Error updating set:", setError);
    return;
  }

  const { error: deleteError } = await supabase
    .from("aspects")
    .delete()
    .match({ set_id: id });

  if (deleteError) {
    console.error("Error deleting aspects:", deleteError);
    return;
  }

  const { error: insertError } = await supabase
    .from("aspects")
    .insert(
      data.aspects.map(aspect => ({
        ...aspect,
        set_id: id,
      }))
    );

  if (insertError) {
    console.error("Error inserting aspects:", insertError);
    return;
  }

  console.log("Set and aspects successfully updated");
}

export async function deleteSetById(id: string): Promise<void> {
  const supabase = createClient();

  // First, delete related aspects to maintain database integrity
  const { error: deleteAspectsError } = await supabase
    .from("aspects")
    .delete()
    .match({ set_id: id });

  if (deleteAspectsError) {
    console.error("Error deleting aspects:", deleteAspectsError);
    return;
  }

  // Then, delete the set itself
  const { error: deleteSetError } = await supabase
    .from("sets")
    .delete()
    .match({ id });

  if (deleteSetError) {
    console.error("Error deleting set:", deleteSetError);
    return;
  }

  console.log("Set and related aspects successfully deleted");
}

export async function getSetById(id: string): Promise<FormValues | null> {
  const supabase = createClient();

  console.log('Fetching data! of id: ' + id)

  const { data: setData, error: setError } = await supabase
    .from("sets")
    .select("*")
    .eq("id", id)
    .single();

  if (setError) {
    console.error("Error fetching set:", setError);
    return null;
  }

  if (!setData) {
    console.error("No set data found");
    return null;
  }

  const { data: aspectsData, error: aspectsError } = await supabase
    .from("aspects")
    .select("*")
    .eq("set_id", id);

  if (aspectsError) {
    console.error("Error fetching aspects:", aspectsError);
    return null;
  }

  return {
    name: setData.name,
    aspects: aspectsData.map(aspect => ({
      name: aspect.name,
      values: aspect.values 
    }))
  };
}
