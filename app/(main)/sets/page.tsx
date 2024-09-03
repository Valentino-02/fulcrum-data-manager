import { getSets } from "@/actions/setActions";
import Link from "next/link";

export default async function SetsPage() {
  const sets = await getSets()
  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
    {sets?.map((set) => <div>{set.name}</div>)}
    </div>
  );
}