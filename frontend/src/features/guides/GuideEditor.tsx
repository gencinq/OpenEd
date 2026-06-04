import React, { useState } from 'react';
import { StudyGuide, GuideSection } from '@shared/types';
import { SUBJECTS, Subject } from '@shared/constants';
import { guidesService } from '../../services/guides.service';
import PdfUploader from '../pdf/PdfUploader';
import PdfList from '../pdf/PdfList';
import { AlertCircle, Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface GuideEditorProps {
  guide?: StudyGuide;
  onSuccess: (guide: StudyGuide) => void;
  onCancel: () => void;
}

export const GuideEditor: React.FC<GuideEditorProps> = ({
  guide,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(guide?.title || '');
  const [description, setDescription] = useState(guide?.description || '');
  const [subject, setSubject] = useState<Subject | ''>((guide?.subject as Subject) || '');
  const [isPublic, setIsPublic] = useState(guide?.isPublic ?? true);
  const [sections, setSections] = useState<GuideSection[]>(guide?.sections || [{ title: '', content: '' }]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedGuide, setSavedGuide] = useState<StudyGuide | null>(guide || null);

  const handleAddSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[swapWith];
    newSections[swapWith] = temp;
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMsg('Guide title is required');
      return;
    }

    const invalidSection = sections.some((sec) => !sec.title.trim() || !sec.content.trim());
    if (invalidSection) {
      setErrorMsg('All sections must have a title and content');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      let resultGuide: StudyGuide;
      if (savedGuide) {
        resultGuide = await guidesService.updateGuide(savedGuide.id, {
          title,
          description: description || undefined,
          subject: subject || undefined,
          sections,
          isPublic,
        });
      } else {
        resultGuide = await guidesService.createGuide({
          title,
          description: description || undefined,
          subject: subject || undefined,
          sections,
          isPublic,
        });
        setSavedGuide(resultGuide);
      }
      onSuccess(resultGuide);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save study guide');
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
          <label className="text-sm font-medium text-muted-foreground" htmlFor="guide-title">Guide Title</label>
          <input
            id="guide-title"
            type="text"
            placeholder="e.g. Physics 101: Mechanics Study Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="guide-desc">Description</label>
          <textarea
            id="guide-desc"
            rows={2}
            placeholder="Brief overview of what this study guide covers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-md border border-input bg-card text-sm focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="guide-subject">Subject</label>
            <select
              id="guide-subject"
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
              id="guide-public-toggle"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="guide-public-toggle" className="text-sm font-medium text-foreground select-none">
              Make study guide public
            </label>
          </div>
        </div>

        {/* Sections Listing */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Guide Sections</h3>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-400 font-medium text-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Section
            </button>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-muted/20 space-y-3 relative group/sec">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded">
                  Section {idx + 1}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover/sec:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1 rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    disabled={sections.length <= 1}
                    className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Section Title (e.g. 1. Kinematics)"
                  value={section.title}
                  onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                  className="w-full h-8 px-2.5 rounded border border-input bg-card text-sm font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  placeholder="Section summary/content (Markdown supported)..."
                  value={section.content}
                  onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                  className="w-full p-2.5 rounded border border-input bg-card text-sm font-mono focus:outline-none resize-y"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Study Guide'}
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

      {savedGuide && (
        <div className="border-t border-border pt-6 mt-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Attachments (PDF)</h3>
          <PdfUploader guideId={savedGuide.id} onUploadSuccess={() => {}} />
          <PdfList guideId={savedGuide.id} />
        </div>
      )}
    </div>
  );
};
export default GuideEditor;
