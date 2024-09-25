'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTags, deleteTagById } from "@/actions/tagActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);  // Adjust the type according to your actual data structure
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tags when the component mounts
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);  // Empty dependency array ensures this runs only once on mount

  const handleDeleteClick = async (id: string) => {
    if (confirmDeleteId === id) {
      // If already in confirm mode, call the delete action
      try {
        await deleteTagById(id);
        setTags((prevTags) => prevTags.filter(tag => tag.id !== id));  // Update the state to remove the deleted tag
        setConfirmDeleteId(null);  // Reset confirmation state
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    } else {
      // Set the id to confirm deletion
      setConfirmDeleteId(id);
    }
  };

  const downloadJSON = () => {
    const jsonData = {
      Tags: tags.map((tag) => ({
        Id: tag.id,
        Name: tag.name,
        RelatedSets: tag.sets.map((set: { name: string }) => set.name),
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tagsWithSets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="items-center flex flex-col gap-6 px-4">
      <div className='flex gap-4'>
      <Link href={'/tags/create'}>
        <Button>
          Create New Tag
        </Button>
      </Link>
      <Button onClick={downloadJSON}>
          Download JSON
      </Button>
      </div>
      <Table>
        <TableCaption>A list of Tags with related Sets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Related Sets</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{tag.name}</TableCell>
              <TableCell>
                {tag.sets.map((set: { name: string }) => set.name).join(", ")}
              </TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/tags/update/${tag.id}`}>
                  <Button className="bg-purple-900 text-white hover:bg-purple-700">
                    Update
                  </Button>
                </Link>
                <Button
                  className="bg-red-600 text-white hover:bg-red-800"
                  onClick={() => handleDeleteClick(tag.id)}
                >
                  {confirmDeleteId === tag.id ? 'Sure?' : 'Remove'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
