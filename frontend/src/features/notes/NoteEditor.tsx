import React, { useState, useEffect } from 'react';
import { Note } from '@shared/types';
import { SUBJECTS, Subject } from '@shared/constants';
import { notesService } from '../../services/notes.service';
import PdfUploader from '../pdf/PdfUploader';
import PdfList from '../pdf/PdfList';
import { AlertCircle } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  onSuccess: (note: Note) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [subject, setSubject] = useState<Subject | ''>((note?.subject as Subject) || '');
  const [isPublic, setIsPublic] = useState(note?.isPublic ?? false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedNote, setSavedNote] = useState<Note | null>(note || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setErrorMsg('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let resultNote: Note;
      if (savedNote) {
        resultNote = await notesService.updateNote(savedNote.id, {
          title,
          content,
          subject: subject || undefined,
          isPublic,
        });
      } else {
        resultNote = await notesService.createNote({
          title,
          content,
          subject: subject || undefined,
          isPublic,
        });
        setSavedNote(resultNote); // set saved so that PDF uploader can now link to it
      }
      onSuccess(resultNote);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="e.g. Introduction to Quantum Mechanics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="note-subject">Subject</label>
            <select
              id="note-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 h-9 mt-6">
            <input
              id="note-public-toggle"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="note-public-toggle" className="text-sm font-medium text-foreground select-none">
              Make this note public (visible to everyone)
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="note-content">
            Content (Markdown supported)
          </label>
          <textarea
            id="note-content"
            rows={10}
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-md border border-input bg-card text-sm font-mono focus:outline-none resize-y"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Note'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-4 rounded-md border border-input bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* PDF attachments section: enabled only after note is first saved to DB */}
      {savedNote && (
        <div className="border-t border-border pt-6 mt-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Attachments (PDF)</h3>
          <PdfUploader noteId={savedNote.id} onUploadSuccess={() => {}} />
          <PdfList noteId={savedNote.id} />
        </div>
      )}
    </div>
  );
};
export default NoteEditor;
