import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, HelpCircle, User } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import SubjectTag from './SubjectTag';

interface ContentCardProps {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
  type: 'note' | 'guide' | 'question';
  answerCount?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  description,
  subject,
  createdAt,
  authorName,
  authorAvatar,
  type,
  answerCount,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'guide':
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case 'question':
        return <HelpCircle className="h-4 w-4 text-violet-500" />;
    }
  };

  const getLinkPath = () => {
    switch (type) {
      case 'note':
        return `/notes/${id}`;
      case 'guide':
        return `/guides/${id}`;
      case 'question':
        return `/questions/${id}`;
    }
  };

  return (
    <div className="group flex flex-col justify-between p-5 rounded-lg border border-border bg-card shadow-sm hover:shadow-md hover:border-muted transition-all duration-200 hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            {getIcon()}
            <span>{type}</span>
          </div>
          {subject && <SubjectTag subject={subject} />}
        </div>

        <Link to={getLinkPath()} className="block">
          <h3 className="text-base font-semibold leading-snug text-foreground hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2 text-xs text-muted-foreground">
        {authorName ? (
          <div className="flex items-center gap-2">
            <img
              src={authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`}
              alt={authorName}
              className="h-6 w-6 rounded-full border border-border"
            />
            <span className="truncate max-w-[100px] text-foreground font-medium">{authorName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>Anonymous</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {type === 'question' && typeof answerCount === 'number' && (
            <span className="bg-muted px-2 py-0.5 rounded-full text-foreground font-medium">
              {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
            </span>
          )}
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
export default ContentCard;
