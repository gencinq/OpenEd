import React, { useEffect, useState } from 'react';
import { PdfResource } from '@shared/types';
import { pdfService } from '../../services/pdf.service';
import { FileText, Download, Trash, Loader2 } from 'lucide-react';
import { formatBytes } from '../../lib/utils';

interface PdfListProps {
  noteId?: string;
  guideId?: string;
}

export const PdfList: React.FC<PdfListProps> = ({ noteId, guideId }) => {
  const [pdfs, setPdfs] = useState<PdfResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const data = await pdfService.listForResource({ noteId, guideId });
      setPdfs(data);
    } catch (err) {
      console.error('Failed to fetch attached PDFs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [noteId, guideId]);

  if (loading) {
    return <div className="text-sm text-muted-foreground py-2 flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading attachments...</div>;
  }

  if (pdfs.length === 0) {
    return <div className="text-xs text-muted-foreground py-1">No attached PDF resources.</div>;
  }

  return (
    <div className="space-y-2">
      {pdfs.map((pdf) => (
        <div key={pdf.id} className="flex items-center justify-between p-2.5 rounded border border-border bg-card text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-4 w-4 text-red-500 shrink-0" />
            <div className="truncate">
              <div className="font-semibold truncate text-foreground" title={pdf.filename}>
                {pdf.filename}
              </div>
              {pdf.fileSize && (
                <div className="text-[10px] text-muted-foreground">{formatBytes(pdf.fileSize)}</div>
              )}
            </div>
          </div>

          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-indigo-600 transition-colors"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  );
};
export default PdfList;
