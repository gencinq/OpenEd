import React from 'react';
import { StudyGuide } from '@shared/types';
import ContentCard from '../../components/shared/ContentCard';

interface GuideListProps {
  guides: StudyGuide[];
}

export const GuideList: React.FC<GuideListProps> = ({ guides }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <ContentCard
          key={guide.id}
          id={guide.id}
          title={guide.title}
          description={guide.description}
          subject={guide.subject}
          createdAt={guide.createdAt}
          authorName={guide.author?.displayName}
          authorAvatar={guide.author?.avatarUrl}
          type="guide"
        />
      ))}
    </div>
  );
};
export default GuideList;
