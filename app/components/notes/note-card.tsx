import { Link, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };


interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const fetcher = useFetcher<any>();
  const [isFavourite, setIsFavourite] = useState<boolean>(note.isFavourite);

  useEffect(() => {
    if (
      fetcher.data?.note?.isFavourite !== undefined
    ) {
      setIsFavourite(fetcher.data.note.isFavourite);
    }
  }, [fetcher]);

  function handleToggle() {
    const newStatus = !isFavourite;
    setIsFavourite(newStatus); 

    fetcher.submit(
      {
        noteId: String(note.id),
        isFavourite: String(newStatus),
      },
      {
        method: "post",
        action: "/notes/favourite",
      }
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-none relative">
        <span
          className="cursor-pointer text-2xl"
          style={{
            color: isFavourite ? "gold" : "gray",
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
          }}
          onClick={handleToggle}
        >
          ★
        </span>
        <CardTitle className="line-clamp-2">
          <Link to={`/notes/${note.id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>
      <CardFooter className="flex-none border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(note.createdAt)}
        </p>
      </CardFooter>
    </Card>
  );
}
