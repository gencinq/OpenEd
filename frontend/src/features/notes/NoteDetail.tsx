import React, { useEffect, useState } from 'react';
import { Note, PdfResource } from '@shared/types';
import { notesService } from '../../services/notes.service';
import { pdfService } from '../../services/pdf.service';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';
import SubjectTag from '../../components/shared/SubjectTag';
import { formatDate } from '../../lib/utils';
import { ArrowLeft, Edit, Trash, FileText, Download } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const NoteDetail: React.FC<NoteDetailProps> = ({
  noteId,
  onBack,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [pdfs, setPdfs] = useState<PdfResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        setLoading(true);
        const fetchedNote = await notesService.getNote(noteId);
        setNote(fetchedNote);

        const fetchedPdfs = await pdfService.listForResource({ noteId });
        setPdfs(fetchedPdfs);
      } catch (err: any) {
        setError(err.message || 'Failed to load note details');
      } finally {
        setLoading(false);
      }
    };
    fetchNoteData();
  }, [noteId]);

  if (loading) {
    return <div className="text-center p-8 text-muted-foreground animate-pulse">Loading note content...</div>;
  }

  if (error || !note) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error || 'Note not found'}</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Go back
        </button>
      </div>
    );
  }

  const isOwner = user?.id === note.userId;

  return (
    <article className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-red-200 bg-card text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <Trash className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-2">
          {note.subject && <SubjectTag subject={note.subject} />}
          <span className="text-xs text-muted-foreground uppercase font-semibold">
            {note.isPublic ? 'Public Note' : 'Private Note'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
          {note.title}
        </h1>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground border-b border-border pb-4">
          <img
            src={note.author?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${note.author?.displayName}`}
            alt={note.author?.displayName}
            className="h-8 w-8 rounded-full border border-border"
          />
          <div>
            <span className="text-foreground font-medium">{note.author?.displayName}</span>
            <span className="mx-2">•</span>
            <span>Created on {formatDate(note.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Note Markdown Content */}
      <section className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
        <MarkdownRenderer content={note.content} />
      </section>

      {/* Attached PDFs */}
      {pdfs.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" /> Attached PDF Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pdfs.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-red-500 shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]" title={pdf.filename}>
                    {pdf.filename}
                  </span>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
export default NoteDetail;
