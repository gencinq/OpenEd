import React, { useEffect, useState } from 'react';
import { StudyGuide, PdfResource } from '@shared/types';
import { guidesService } from '../../services/guides.service';
import { pdfService } from '../../services/pdf.service';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';
import SubjectTag from '../../components/shared/SubjectTag';
import { formatDate } from '../../lib/utils';
import { ArrowLeft, Edit, Trash, FileText, Download, ChevronRight, File } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface GuideDetailProps {
  guideId: string;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const GuideDetail: React.FC<GuideDetailProps> = ({
  guideId,
  onBack,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [pdfs, setPdfs] = useState<PdfResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        setLoading(true);
        const fetchedGuide = await guidesService.getGuide(guideId);
        setGuide(fetchedGuide);

        const fetchedPdfs = await pdfService.listForResource({ guideId });
        setPdfs(fetchedPdfs);
      } catch (err: any) {
        setError(err.message || 'Failed to load study guide details');
      } finally {
        setLoading(false);
      }
    };
    fetchGuideData();
  }, [guideId]);

  if (loading) {
    return <div className="text-center p-8 text-muted-foreground animate-pulse">Loading study guide content...</div>;
  }

  if (error || !guide) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error || 'Study guide not found'}</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Go back
        </button>
      </div>
    );
  }

  const isOwner = user?.id === guide.userId;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar */}
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
                <Edit className="h-3.5 w-3.5" /> Edit Guide
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

      {/* Hero Header */}
      <header className="space-y-4 bg-muted/30 p-6 md:p-8 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          {guide.subject && <SubjectTag subject={guide.subject} />}
          <span className="text-xs text-muted-foreground uppercase font-semibold">
            {guide.isPublic ? 'Public Guide' : 'Private Guide'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
          {guide.title}
        </h1>
        {guide.description && (
          <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">{guide.description}</p>
        )}
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4 border-t border-border/60">
          <img
            src={guide.author?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${guide.author?.displayName}`}
            alt={guide.author?.displayName}
            className="h-8 w-8 rounded-full border border-border"
          />
          <div>
            <span className="text-foreground font-medium">{guide.author?.displayName}</span>
            <span className="mx-2">•</span>
            <span>Created on {formatDate(guide.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Guide layout splits into Sidebar Navigation and Section Content Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Sections Selector */}
        <aside className="md:col-span-1 space-y-2">
          <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-3 px-1">
            Guide Sections ({guide.sections.length})
          </div>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
            {guide.sections.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSectionIdx(idx)}
                className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${
                  activeSectionIdx === idx
                    ? 'border-indigo-200 bg-indigo-50/50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400'
                    : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span className="truncate pr-2">{sec.title || `Section ${idx + 1}`}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 hidden md:block transition-transform ${activeSectionIdx === idx ? 'translate-x-0.5' : 'opacity-40'}`} />
              </button>
            ))}
          </div>
        </aside>

        {/* Section View Panel */}
        <main className="md:col-span-3 bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm h-fit">
          {guide.sections[activeSectionIdx] ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                {guide.sections[activeSectionIdx].title}
              </h2>
              <MarkdownRenderer content={guide.sections[activeSectionIdx].content} />
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">No section content found.</div>
          )}
        </main>
      </div>

      {/* PDFs resources list */}
      {pdfs.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-border">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <File className="h-4 w-4 text-indigo-500" /> Attached PDFs for study references
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
    </div>
  );
};
export default GuideDetail;
