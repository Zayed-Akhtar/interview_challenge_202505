import React, { useState } from 'react';
import { NoteCard } from './note-card';
import { type Note } from "~/db/schema";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NotesListProps {
  notes: SerializedNote[];
  itemsPerPage?: number;
}

export default function NotesList ({ notes, itemsPerPage = 10 }: NotesListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(notes.length / itemsPerPage);

  const paginatedNotes = notes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            disabled={currentPage === pageNum}
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: currentPage === pageNum ? '#ddd' : '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};
