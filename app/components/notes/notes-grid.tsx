import { type Note } from "~/db/schema";
import { NoteCard } from "./note-card";
import NotesList from "./notes-list";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NotesGridProps {
  notes: SerializedNote[];
  emptyMessage?: string;
}

export function NotesGrid({
  notes,
  emptyMessage = "No notes found.",
}: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <NotesList notes={notes} itemsPerPage={10}/>
    </div>
  );
}
