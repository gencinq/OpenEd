import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionDetail from '../features/questions/QuestionDetail';
import { questionsService } from '../services/questions.service';

export const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm('Are you sure you want to delete this question?');
    if (!confirm) return;

    try {
      await questionsService.deleteQuestion(id);
      navigate('/explore?tab=questions');
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  if (!id) return null;

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <QuestionDetail
          questionId={id}
          onBack={() => navigate('/explore?tab=questions')}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
export default QuestionPage;
