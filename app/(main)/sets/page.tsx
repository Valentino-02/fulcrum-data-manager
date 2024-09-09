import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getSets } from "@/actions/setActions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SetsPage() {
  const sets = await getSets()
  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
    <Table>
  <TableCaption>A list of Aspect Sets.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>Aspects</TableHead>
      <TableHead>Related Tags</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sets?.map((set) => <TableRow key={set.id}>
   <TableCell className="font-medium">{set.name}</TableCell>
   <TableCell>
   {set.aspects.map((aspect: { name: any; }) => aspect.name).join(", ")}
   </TableCell>
   <TableCell>
   {set.tags.map((tag: { name: any; }) => tag.name).join(", ")}
   </TableCell>
 </TableRow>)}
  </TableBody>
</Table>
<Link href={'/sets/newSet'}>    <Button>
      Create New Set
    </Button></Link>

    </div>
  );
}