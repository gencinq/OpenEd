import React from 'react';
import { Note } from '@shared/types';
import ContentCard from '../../components/shared/ContentCard';

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <ContentCard
          key={note.id}
          id={note.id}
          title={note.title}
          description={note.content}
          subject={note.subject}
          createdAt={note.createdAt}
          authorName={note.author?.displayName}
          authorAvatar={note.author?.avatarUrl}
          type="note"
        />
      ))}
    </div>
  );
};
export default NoteList;
