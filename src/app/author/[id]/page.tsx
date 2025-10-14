import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function AuthorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();
  const { id } = await params;
  const authorId = parseInt(id);

  if (isNaN(authorId)) {
    return <div>Invalid Author id</div>;
  }

  const author = await db
    .selectFrom("authors")
    .select(["name", "bio"])
    .where("id", "=", authorId)
    .executeTakeFirst();

  if (!author) {
    return <div>Author was not found</div>;
  }

  const albums = await db
    .selectFrom("albums")
    .select(["id", "name"])
    .where("author_id", "=", authorId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="mt-4">{author.bio}</p>
        </div>

        <div className="w-full">
          <h2 className="text-2xl">Albums</h2>
          <ul>
            {albums.map((album) => (
              <li key={album.id} className="mb-2">
                <Link
                  href={`/album/${album.id}`}
                  className="text-red-500"
                >
                  {album.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}