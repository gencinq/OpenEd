import React, { useState } from 'react';
import { pdfService } from '../../services/pdf.service';
import { FileUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@shared/constants';

interface PdfUploaderProps {
  noteId?: string;
  guideId?: string;
  onUploadSuccess?: () => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  noteId,
  guideId,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are allowed');
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setErrorMsg('File size exceeds the 10MB limit');
      setFile(null);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await pdfService.uploadPdf(file, noteId, guideId);
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload PDF. Please check your storage config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-border bg-card shadow-sm space-y-3">
      {errorMsg && (
        <div className="flex items-center gap-2 p-2.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-2.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded">
          <CheckCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <label className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-input border-dashed bg-muted/40 cursor-pointer hover:bg-muted/70 transition-colors text-xs font-medium text-muted-foreground">
          <FileUp className="h-4 w-4" />
          <span>{file ? file.name : 'Choose a PDF file (max 10MB)'}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={loading || !file}
          className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <span>Upload PDF</span>
          )}
        </button>
      </form>
    </div>
  );
};
export default PdfUploader;
