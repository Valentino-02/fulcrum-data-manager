import { createClient } from "@/utils/supabase/client";
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
      values: z.array(z.string()).length(5, {
        message: "There must be exactly 5 values.",
      }),
    })
  ),
})

export type FormValues = z.infer<typeof formSchema>

export async function addSet(data: FormValues) {
  const supabase = createClient();

  const { data: setData, error: setError } = await supabase
    .from("sets")
    .insert({ name: data.name })
    .select(); 

  if (setError) {
    console.error("Error inserting set:", setError);
    return;
  }
  if (!setData) {
    console.error("No set data returned");
    return;
  }

  const setId = setData[0].id


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
