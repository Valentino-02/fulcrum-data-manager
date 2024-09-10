import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSets } from "@/actions/setActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SetsPage() {
  const sets = await getSets();

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
            <TableHead>Actions</TableHead> {/* New column for actions */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets?.map((set) => (
            <TableRow key={set.id}>
              <TableCell className="font-medium">{set.name}</TableCell>
              <TableCell>
                {set.aspects.map((aspect: { name: string; }) => aspect.name).join(", ")}
              </TableCell>
              <TableCell>
                {set.tags.map((tag: { name: string; }) => tag.name).join(", ")}
              </TableCell>
              <TableCell>
                <Link href={`/sets/update/${set.id}`}>
                  <Button className="bg-purple-900 text-white hover:bg-purple-700">
                    Update
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

