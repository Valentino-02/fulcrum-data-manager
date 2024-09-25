'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { addTag } from '@/actions/tagActions';

import { getSets } from '@/actions/setActions';
import { SelectLabel } from '@radix-ui/react-select';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Tag name is required.'
  }),
  sets: z.array(
    z.object({
      id: z.string().min(1, { message: 'Set is required.' })
    })
  )
});

export type FormValues = z.infer<typeof formSchema>;

export default function CreateTagPage() {
  const router = useRouter();
  const [availableSets, setAvailableSets] = useState<any[]>([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const data = await getSets();
        setAvailableSets(data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };

    fetchSets();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sets: [{ id: '' }]
    }
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sets'
  });

  const onSubmit = (data: FormValues) => {
    addTag(data).then(() => {
      console.log(data);
      router.push('/tags');
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Link href={'/tags'}>
        <Button>Go to Tags</Button>
      </Link>

      <Card className="p-6 max-w-4xl mx-auto bg-gray-950 text-gray-100 shadow-lg">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Tag Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tag name"
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
              {fields.map((set, index) => (
                <div
                  key={set.id}
                  className="relative p-4 border border-gray-700 rounded-md bg-gray-900"
                >
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-400"
                      aria-label="Remove Set"
                      disabled={fields.length <= 1}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">Set {index + 1}</h3>

                  <div className="flex gap-4">
                    <FormField
                      control={control}
                      name={`sets.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-gray-300">Select Set</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                <SelectValue placeholder="Select a set">
                                  {field.value
                                    ? availableSets.find((set) => set.id == field.value)?.name ||
                                      'Select a set'
                                    : 'Select a set'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Sets</SelectLabel>
                                  {availableSets.map((set) => (
                                    <SelectItem key={set.id} value={set.id}>
                                      {set.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                type="button"
                onClick={() => append({ id: '' })}
                className="bg-emerald-900 text-gray-100 hover:bg-emerald-700"
              >
                Add Set
              </Button>
              <Button type="submit" className="bg-emerald-700 text-gray-100 hover:bg-emerald-500">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
