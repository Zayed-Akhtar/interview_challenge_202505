import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { updateNoteFavourite } from "~/services/notes.server";


export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  const formData = await request.formData();
  const noteIdRaw = formData.get("noteId");
  const isFavRaw = formData.get("isFavourite");

  if (!noteIdRaw || typeof noteIdRaw !== "string") {
    return json({ error: "Missing noteId" }, { status: 400 });
  }
  if (isFavRaw !== "true" && isFavRaw !== "false") {
    return json({ error: "Missing or invalid isFavourite" }, { status: 400 });
  }

  const noteId = Number(noteIdRaw);
  const isFavourite = isFavRaw === "true";

  try {
    const updatedNote = await updateNoteFavourite(noteId, isFavourite);
    if (!updatedNote) {
      return json({ error: "Note not found or not yours" }, { status: 404 });
    }
    return json({ success: true, note: updatedNote });
  } catch (err) {
    console.error("Failed to update favourite:", err);
    return json({ error: "Server error" }, { status: 500 });
  }
}
