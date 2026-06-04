import React, { useState } from 'react';
import { Question } from '@shared/types';
import { SUBJECTS, Subject } from '@shared/constants';
import { questionsService } from '../../services/questions.service';
import { AlertCircle } from 'lucide-react';

interface QuestionFormProps {
  onSuccess: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      setErrorMsg('Title and body are required to ask a question');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await questionsService.createQuestion({
        title,
        body,
        subject: subject || undefined
      });
      onSuccess(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">Ask a Public Question</h3>
        <p className="text-xs text-muted-foreground">Explain your question clearly so others can help you</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="q-title">Title</label>
          <input
            id="q-title"
            type="text"
            placeholder="Be specific. e.g. What is the difference between map() and flatMap() in RxJS?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="q-subject">Subject (Optional)</label>
          <select
            id="q-subject"
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

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="q-body">
            Body (Markdown supported)
          </label>
          <textarea
            id="q-body"
            rows={8}
            placeholder="Provide context, share what you've tried, and insert code snippet format if necessary..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
            {isSubmitting ? 'Posting...' : 'Post Question'}
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
    </div>
  );
};
export default QuestionForm;
