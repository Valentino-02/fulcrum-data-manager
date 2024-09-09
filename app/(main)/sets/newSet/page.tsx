"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { X } from 'lucide-react';
import { addSet } from "@/actions/setClientActions"

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

export default function NewSetPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      aspects: [{ name: "", values: ["", "", "", "", ""] }],
    },
  })

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "aspects",
  })

  const onSubmit = (data: FormValues) => {
    addSet(data)
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto bg-gray-950 text-gray-100 shadow-lg">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Set Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter set name"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            {fields.map((aspect, index) => (
              <div
                key={aspect.id}
                className="relative p-4 border border-gray-700 rounded-md bg-gray-900"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-400"
                    aria-label="Remove Aspect"
                    disabled={fields.length <= 1}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Aspect {index + 1}</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-4 mb-4">
                    <FormField
                      control={control}
                      name={`aspects.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-gray-300">Aspect Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter aspect name"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {aspect.values.map((_, valueIndex) => (
                      <FormField
                        key={valueIndex}
                        control={control}
                        name={`aspects.${index}.values.${valueIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-gray-300">Value {valueIndex + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter value ${valueIndex + 1}`}
                                {...field}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={() => append({ name: "", values: ["", "", "", "", ""] })}
              className="bg-emerald-900 text-gray-100 hover:bg-emerald-700"
            >
              Add Aspect
            </Button>
            <Button
              type="submit"
              className="bg-emerald-700 text-gray-100 hover:bg-emerald-500"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
