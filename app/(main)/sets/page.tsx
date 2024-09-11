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
import { getSets, deleteSetById } from "@/actions/setClientActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SetsPage() {
  const [sets, setSets] = useState<any[]>([]);  // Adjust the type according to your actual data structure
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch sets when the component mounts
    const fetchSets = async () => {
      try {
        const data = await getSets();
        setSets(data);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };

    fetchSets();
  }, []);  // Empty dependency array ensures this runs only once on mount

  const handleDeleteClick = async (id: string) => {
    if (confirmDeleteId === id) {
      // If already in confirm mode, call the delete action
      try {
        await deleteSetById(id);
        setSets((prevSets) => prevSets.filter(set => set.id !== id));  // Update the state to remove the deleted set
        setConfirmDeleteId(null);  // Reset confirmation state
      } catch (error) {
        console.error("Error deleting set:", error);
      }
    } else {
      // Set the id to confirm deletion
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="items-center flex flex-col gap-6 px-4">
      <Link href={'/sets/create'}>
        <Button>
          Create New Set
        </Button>
      </Link>
      <Table>
        <TableCaption>A list of Aspect Sets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Aspects</TableHead>
            <TableHead>Related Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <TableRow key={set.id}>
              <TableCell className="font-medium">{set.name}</TableCell>
              <TableCell>
                {set.aspects.map((aspect: { name: string }) => aspect.name).join(", ")}
              </TableCell>
              <TableCell>
                {set.tags.map((tag: { name: string }) => tag.name).join(", ")}
              </TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/sets/update/${set.id}`}>
                  <Button className="bg-purple-900 text-white hover:bg-purple-700">
                    Update
                  </Button>
                </Link>
                <Button
                  className="bg-red-600 text-white hover:bg-red-800"
                  onClick={() => handleDeleteClick(set.id)}
                >
                  {confirmDeleteId === set.id ? 'Sure?' : 'Remove'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
