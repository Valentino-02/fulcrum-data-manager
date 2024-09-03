import Link from "next/link";

export default async function TagsPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 px-4">
      <div className="flex gap-5 items-center font-semibold hover:text-purple-700 duration-300">
        <Link href={"/sets"}>Aspect Sets</Link>
      </div>
      <div className="flex gap-5 items-center font-semibold hover:text-purple-700 duration-300">
        <Link href={"/tags"}>Context Tags</Link>
      </div>
    </div>
  );
}