import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GuideDetail from '../features/guides/GuideDetail';
import GuideEditor from '../features/guides/GuideEditor';
import { guidesService } from '../services/guides.service';

export const StudyGuidePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this study guide?');
    if (!confirm) return;

    try {
      await guidesService.deleteGuide(id);
      navigate('/explore?tab=guides');
    } catch (err: any) {
      alert(err.message || 'Failed to delete study guide');
    }
  };

  if (!id) return null;

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {isEditing ? (
          <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Edit Study Guide</h2>
            <GuideEditorWrapper guideId={id} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          </div>
        ) : (
          <GuideDetail
            guideId={id}
            onBack={() => navigate('/explore?tab=guides')}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

const GuideEditorWrapper: React.FC<{ guideId: string; onSuccess: () => void; onCancel: () => void }> = ({ guideId, onSuccess, onCancel }) => {
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    guidesService.getGuide(guideId).then((g) => {
      setGuide(g);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [guideId]);

  if (loading) return <div className="text-center py-6 text-muted-foreground animate-pulse">Loading editor...</div>;
  if (!guide) return <div className="text-center text-red-500 py-6">Failed to load guide details for editing</div>;

  return <GuideEditor guide={guide} onSuccess={onSuccess} onCancel={onCancel} />;
};

export default StudyGuidePage;
