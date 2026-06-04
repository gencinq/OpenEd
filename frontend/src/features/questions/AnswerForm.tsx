import React, { useState } from 'react';

interface AnswerFormProps {
  onSubmit: (body: string) => Promise<void>;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit }) => {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(body);
      setBody('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={5}
        placeholder="Write your answer here (Markdown supported)..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-3 rounded-md border border-input bg-card text-sm font-mono focus:outline-none resize-y"
        required
      />
      <button
        type="submit"
        disabled={submitting || !body.trim()}
        className="h-8 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Post Answer'}
      </button>
    </form>
  );
};
export default AnswerForm;
