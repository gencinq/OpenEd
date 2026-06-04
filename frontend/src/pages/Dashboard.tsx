import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import NoteList from '../features/notes/NoteList';
import GuideList from '../features/guides/GuideList';
import QuestionList from '../features/questions/QuestionList';
import NoteEditor from '../features/notes/NoteEditor';
import GuideEditor from '../features/guides/GuideEditor';
import QuestionForm from '../features/questions/QuestionForm';
import PdfUploader from '../features/pdf/PdfUploader';
import PdfList from '../features/pdf/PdfList';
import { notesService } from '../services/notes.service';
import { guidesService } from '../services/guides.service';
import { questionsService } from '../services/questions.service';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { FileText, BookOpen, HelpCircle, FileUp, Plus, Shield } from 'lucide-react';
import { authService } from '../services/auth.service';

type DashboardTab = 'notes' | 'guides' | 'questions' | 'pdf' | 'admin';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL query search params
  const searchParams = new URLSearchParams(location.search);
  const activeTab = (searchParams.get('tab') as DashboardTab) || 'notes';

  const [notes, setNotes] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // States to control creation modal dialog toggles
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showGuideEditor, setShowGuideEditor] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Admin states
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const fetchUserContent = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (activeTab === 'notes') {
        const res = await notesService.getNotes();
        // Filter notes created by current user
        setNotes(res.notes.filter((n) => n.userId === user.id));
      } else if (activeTab === 'guides') {
        const res = await guidesService.getGuides();
        setGuides(res.guides.filter((g) => g.userId === user.id));
      } else if (activeTab === 'questions') {
        const res = await questionsService.getQuestions();
        setQuestions(res.questions.filter((q) => q.userId === user.id));
      } else if (activeTab === 'admin' && user.role === 'admin') {
        setAdminLoading(true);
        const res = await authService.listUsers(1, 100);
        setAllUsers(res.users);
        setAdminLoading(false);
      }
    } catch (err) {
      console.error('Failed to load dashboard content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserContent();
  }, [activeTab, user]);

  const handleTabChange = (tab: DashboardTab) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner size="lg" className="my-12" />;
    }

    switch (activeTab) {
      case 'notes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">My Study Notes</h2>
              <button
                onClick={() => setShowNoteEditor(true)}
                className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Note
              </button>
            </div>
            {notes.length > 0 ? (
              <NoteList notes={notes} />
            ) : (
              <EmptyState
                title="No notes found"
                description="Share study summaries, concepts, or formulas with peers by creating your first note."
                action={
                  <button
                    onClick={() => setShowNoteEditor(true)}
                    className="h-8 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                  >
                    Create Note
                  </button>
                }
              />
            )}
          </div>
        );

      case 'guides':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">My Study Guides</h2>
              <button
                onClick={() => setShowGuideEditor(true)}
                className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Guide
              </button>
            </div>
            {guides.length > 0 ? (
              <GuideList guides={guides} />
            ) : (
              <EmptyState
                title="No study guides found"
                description="Create a structured study guide containing multiple sections for exam prep."
                action={
                  <button
                    onClick={() => setShowGuideEditor(true)}
                    className="h-8 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                  >
                    Create Guide
                  </button>
                }
              />
            )}
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">My Questions</h2>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="h-9 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Ask Question
              </button>
            </div>
            {questions.length > 0 ? (
              <QuestionList questions={questions} />
            ) : (
              <EmptyState
                title="No questions found"
                description="Ask academic questions or homework problems to get answers from the community."
                action={
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="h-8 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                  >
                    Ask Question
                  </button>
                }
              />
            )}
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">PDF Storage Manager</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload study guide PDFs or textbook chapters. You can attach PDFs directly inside note and guide editors.
            </p>
            <PdfUploader onUploadSuccess={() => handleTabChange('pdf')} />
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-foreground mb-3">All Uploaded Files</h3>
              <PdfList noteId="" guideId="" />
            </div>
          </div>
        );

      case 'admin':
        if (user?.role !== 'admin') return <div className="text-red-500 font-semibold p-4">Unauthorized access</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" /> Admin Moderation Dashboard
            </h2>
            {adminLoading ? (
              <LoadingSpinner size="md" />
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold border-b border-border">
                    <tr>
                      <th className="px-6 py-3">Display Name</th>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium text-foreground">{u.displayName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            u.role === 'admin' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-muted/10 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-5xl">
        {/* Dynamic dialog editor mockups / triggers */}
        {showNoteEditor && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex justify-center">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl p-6 h-fit">
              <h2 className="text-xl font-bold text-foreground mb-4">Create New Note</h2>
              <NoteEditor
                onSuccess={() => {
                  setShowNoteEditor(false);
                  fetchUserContent();
                }}
                onCancel={() => setShowNoteEditor(false)}
              />
            </div>
          </div>
        )}

        {showGuideEditor && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex justify-center">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl p-6 h-fit">
              <h2 className="text-xl font-bold text-foreground mb-4">Create Study Guide</h2>
              <GuideEditor
                onSuccess={() => {
                  setShowGuideEditor(false);
                  fetchUserContent();
                }}
                onCancel={() => setShowGuideEditor(false)}
              />
            </div>
          </div>
        )}

        {showQuestionForm && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex justify-center">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl p-6 h-fit">
              <QuestionForm
                onSuccess={() => {
                  setShowQuestionForm(false);
                  fetchUserContent();
                }}
                onCancel={() => setShowQuestionForm(false)}
              />
            </div>
          </div>
        )}

        {/* Render Tab UI */}
        <div className="flex border-b border-border mb-6 md:hidden">
          <button
            onClick={() => handleTabChange('notes')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground'}`}
          >
            Notes
          </button>
          <button
            onClick={() => handleTabChange('guides')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 ${activeTab === 'guides' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground'}`}
          >
            Guides
          </button>
          <button
            onClick={() => handleTabChange('questions')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 ${activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground'}`}
          >
            Q&A
          </button>
          <button
            onClick={() => handleTabChange('pdf')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 ${activeTab === 'pdf' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground'}`}
          >
            PDF
          </button>
        </div>

        {/* Desktop Admin tab trigger */}
        {user?.role === 'admin' && (
          <div className="hidden md:flex gap-2 mb-6 justify-end">
            <button
              onClick={() => handleTabChange(activeTab === 'admin' ? 'notes' : 'admin')}
              className={`h-8 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Area</span>
            </button>
          </div>
        )}

        {renderTabContent()}
      </main>
    </div>
  );
};
export default Dashboard;
