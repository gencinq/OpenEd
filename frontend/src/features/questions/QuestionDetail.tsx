import React, { useEffect, useState } from 'react';
import { Question, Answer } from '@shared/types';
import { questionsService } from '../../services/questions.service';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';
import SubjectTag from '../../components/shared/SubjectTag';
import { formatDate } from '../../lib/utils';
import { ArrowLeft, Trash, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AnswerItem from './AnswerItem';
import AnswerForm from './AnswerForm';

interface QuestionDetailProps {
  questionId: string;
  onBack: () => void;
  onDelete?: () => void;
}

export const QuestionDetail: React.FC<QuestionDetailProps> = ({
  questionId,
  onBack,
  onDelete
}) => {
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const data = await questionsService.getQuestion(questionId);
      setQuestion(data.question);
      setAnswers(data.answers);
    } catch (err: any) {
      setError(err.message || 'Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  const handleAnswerSubmit = async (body: string) => {
    try {
      const newAnswer = await questionsService.postAnswer(questionId, { body });
      // Add local author fields
      newAnswer.author = {
        id: user?.id || '',
        displayName: user?.displayName || 'You',
        avatarUrl: user?.avatarUrl,
        email: '',
        role: 'user',
        createdAt: '',
        updatedAt: ''
      };
      setAnswers((prev) => [...prev, newAnswer]);
      if (question) {
        setQuestion({
          ...question,
          answerCount: (question.answerCount || 0) + 1
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post answer');
    }
  };

  const handleUpvote = async (answerId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to upvote answers');
      return;
    }
    try {
      const upvotes = await questionsService.upvoteAnswer(answerId);
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerId ? { ...a, upvotes } : a))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to upvote answer');
    }
  };

  const handleAccept = async (answerId: string) => {
    try {
      await questionsService.acceptAnswer(answerId);
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerId ? { ...a, isAccepted: true } : { ...a, isAccepted: false }))
      );
      if (question) {
        setQuestion({ ...question, acceptedAnswerId: answerId });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to accept answer');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-muted-foreground animate-pulse">Loading question thread...</div>;
  }

  if (error || !question) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error || 'Question not found'}</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Go back
        </button>
      </div>
    );
  }

  const isOwner = user?.id === question.userId;

  return (
    <article className="space-y-6 max-w-4xl mx-auto">
      {/* Header Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Q&A Forum
        </button>

        {isOwner && onDelete && (
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-red-200 bg-card text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <Trash className="h-3.5 w-3.5" /> Delete Question
          </button>
        )}
      </div>

      {/* Main Question Body */}
      <div className="border border-border bg-card rounded-lg p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          {question.subject && <SubjectTag subject={question.subject} />}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
            <span>Question</span>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
          {question.title}
        </h1>

        <div className="border-t border-border pt-4">
          <MarkdownRenderer content={question.body} />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border/60">
          <img
            src={question.author?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${question.author?.displayName}`}
            alt={question.author?.displayName}
            className="h-7 w-7 rounded-full border border-border"
          />
          <div>
            Asked by <span className="text-foreground font-medium">{question.author?.displayName}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
          <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" />
          <span>{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</span>
        </h3>

        {answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerItem
                key={answer.id}
                answer={answer}
                onUpvote={() => handleUpvote(answer.id)}
                onAccept={() => handleAccept(answer.id)}
                canAccept={isOwner && !question.acceptedAnswerId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">No answers posted yet. Be the first to answer!</div>
        )}
      </div>

      {/* Post Answer Block */}
      <div className="pt-6 border-t border-border">
        {isAuthenticated ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Your Answer</h3>
            <AnswerForm onSubmit={handleAnswerSubmit} />
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-muted/40 text-center text-sm text-muted-foreground">
            Please log in or register to post an answer to this question.
          </div>
        )}
      </div>
    </article>
  );
};
export default QuestionDetail;
