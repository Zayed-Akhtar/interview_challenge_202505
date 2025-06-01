import { db, notes, type Note, type NewNote } from "~/db/schema";
import { sql } from "drizzle-orm";

export async function createNote(data: NewNote): Promise<Note> {
  const [note] = await db.insert(notes).values(data).returning();
  return note;
}

export async function getNoteByIdandUserId(id: number, userId:number): Promise<Note | null> {
  const [note] = await db
    .select()
    .from(notes)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
  return note || null;
}

export async function updateNoteFavourite(noteId: number, isFavourite :boolean): Promise<Note | null> {
  const [updated] = await db
    .update(notes)
    .set({ isFavourite })
    .where(sql`${notes.id} = ${noteId}`)
    .returning();
  return updated;
}

export async function getNotesByUserId(
  userId: number,
  { limit }: { limit?: number } = {}
): Promise<{ notes: Note[] }> {
  const notesList = await db
    .select()
    .from(notes)
    .where(sql`${notes.userId} = ${userId}`)
    .orderBy(sql`${notes.isFavourite} DESC`, sql`${notes.createdAt} DESC`);

  return {
    notes: notesList,
  };
}

export async function updateNote(
  id: number,
  userId: number,
  data: Partial<NewNote>
): Promise<Note | null> {
  const [note] = await db
    .update(notes)
    .set(data)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return note || null;
}

export async function deleteNote(id: number, userId: number): Promise<boolean> {
  const [note] = await db
    .delete(notes)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return !!note;
}
