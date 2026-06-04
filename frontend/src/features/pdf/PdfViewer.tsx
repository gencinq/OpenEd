import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  filename: string;
  url: string;
  onBack: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ filename, url, onBack }) => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[80vh] flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
        </a>
      </div>

      <div className="bg-muted rounded-lg border border-border flex-1 overflow-hidden relative">
        <iframe
          src={url}
          title={filename}
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};
export default PdfViewer;
