import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteDetail from '../features/notes/NoteDetail';
import NoteEditor from '../features/notes/NoteEditor';
import { notesService } from '../services/notes.service';
import { useState } from 'react';

export const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this note?');
    if (!confirm) return;

    try {
      await notesService.deleteNote(id);
      navigate('/explore');
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  if (!id) return null;

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {isEditing ? (
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Note</h2>
            {/* Note details fetch is embedded inside NoteDetail, but we query for editor using fetchNote or let NoteEditor load inside page */}
            {/* To keep it simple, we let NoteEditor receive a note, which can be fetched first, or we load it within editor. */}
            {/* Let's render note editor with full editing context. */}
            <NoteEditorWrapper noteId={id} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          </div>
        ) : (
          <NoteDetail
            noteId={id}
            onBack={() => navigate('/explore')}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

// Sub-component wrapper that fetches note first to display in Editor
const NoteEditorWrapper: React.FC<{ noteId: string; onSuccess: () => void; onCancel: () => void }> = ({ noteId, onSuccess, onCancel }) => {
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    notesService.getNote(noteId).then((n) => {
      setNote(n);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [noteId]);

  if (loading) return <div className="text-center py-6 text-muted-foreground animate-pulse">Loading editor...</div>;
  if (!note) return <div className="text-center text-red-500 py-6">Failed to load note details for editing</div>;

  return <NoteEditor note={note} onSuccess={onSuccess} onCancel={onCancel} />;
};

export default NotePage;
