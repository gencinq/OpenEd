import React from 'react';
import { Question } from '@shared/types';
import ContentCard from '../../components/shared/ContentCard';

interface QuestionListProps {
  questions: Question[];
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {questions.map((q) => (
        <ContentCard
          key={q.id}
          id={q.id}
          title={q.title}
          description={q.body}
          subject={q.subject}
          createdAt={q.createdAt}
          authorName={q.author?.displayName}
          authorAvatar={q.author?.avatarUrl}
          answerCount={q.answerCount}
          type="question"
        />
      ))}
    </div>
  );
};
export default QuestionList;
