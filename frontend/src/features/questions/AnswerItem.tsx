import React from 'react';
import { Answer } from '@shared/types';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';
import { formatDate } from '../../lib/utils';
import { ThumbsUp, Check } from 'lucide-react';

interface AnswerItemProps {
  answer: Answer;
  onUpvote: () => void;
  onAccept: () => void;
  canAccept: boolean;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  onUpvote,
  onAccept,
  canAccept
}) => {
  return (
    <div className={`p-5 rounded-lg border bg-card shadow-sm space-y-3 relative transition-all ${
      answer.isAccepted
        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10'
        : 'border-border'
    }`}>
      {answer.isAccepted && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
          <Check className="h-3.5 w-3.5" /> Accepted Answer
        </span>
      )}

      {/* Answer content */}
      <div className="pr-20 md:pr-0">
        <MarkdownRenderer content={answer.body} />
      </div>

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <img
            src={answer.author?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${answer.author?.displayName}`}
            alt={answer.author?.displayName}
            className="h-6 w-6 rounded-full border border-border"
          />
          <div>
            Answered by <span className="text-foreground font-medium">{answer.author?.displayName}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(answer.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Accept Button (visible to question owner) */}
          {canAccept && (
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors"
            >
              <Check className="h-3.5 w-3.5" /> Accept
            </button>
          )}

          {/* Upvote Button */}
          <button
            onClick={onUpvote}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
            title="Upvote answer"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{answer.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AnswerItem;
