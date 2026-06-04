import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUBJECTS, Subject } from '@shared/constants';
import { notesService } from '../services/notes.service';
import { guidesService } from '../services/guides.service';
import { questionsService } from '../services/questions.service';
import NoteList from '../features/notes/NoteList';
import GuideList from '../features/guides/GuideList';
import QuestionList from '../features/questions/QuestionList';
import LoginForm from '../features/auth/LoginForm';
import RegisterForm from '../features/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/shared/SearchBar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import Pagination from '../components/shared/Pagination';
import { FileText, BookOpen, HelpCircle, Lock, LayoutGrid } from 'lucide-react';

type ExploreTab = 'notes' | 'guides' | 'questions' | 'auth';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as ExploreTab) || 'notes';
  const initialSubject = queryParams.get('subject') || '';
  const initialSearch = queryParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);
  const [subject, setSubject] = useState(initialSubject);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab') as ExploreTab;
    const subParam = searchParams.get('subject');
    const qParam = searchParams.get('q');

    if (tabParam) setActiveTab(tabParam);
    if (subParam !== null) setSubject(subParam);
    if (qParam !== null) setSearch(qParam);
  }, [location.search]);

  const updateUrlParams = (newTab: ExploreTab, newSub: string, newQ: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newTab !== 'notes') params.set('tab', newTab);
    if (newSub) params.set('subject', newSub);
    if (newQ) params.set('q', newQ);
    if (newPage > 1) params.set('page', String(newPage));
    
    navigate(`/explore?${params.toString()}`, { replace: true });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'notes') {
        const res = await notesService.getNotes({ subject: subject || undefined, search: search || undefined, page, limit: 9 });
        setData(res.notes);
        setTotalPages(res.totalPages);
      } else if (activeTab === 'guides') {
        const res = await guidesService.getGuides({ subject: subject || undefined, search: search || undefined, page, limit: 9 });
        setData(res.guides);
        setTotalPages(res.totalPages);
      } else if (activeTab === 'questions') {
        const res = await questionsService.getQuestions({ subject: subject || undefined, search: search || undefined, page, limit: 9 });
        setData(res.questions);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'auth') {
      fetchData();
    }
  }, [activeTab, subject, search, page]);

  const handleTabChange = (tab: ExploreTab) => {
    setActiveTab(tab);
    setPage(1);
    updateUrlParams(tab, subject, search, 1);
  };

  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    setPage(1);
    updateUrlParams(activeTab, newSub, search, 1);
  };

  const handleSearchSubmit = (newQ: string) => {
    setSearch(newQ);
    setPage(1);
    updateUrlParams(activeTab, subject, newQ, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrlParams(activeTab, subject, search, newPage);
  };

  const renderContentList = () => {
    if (loading) {
      return <LoadingSpinner size="lg" className="my-12" />;
    }

    if (data.length === 0) {
      return (
        <EmptyState
          title={`No ${activeTab} found`}
          description={
            search || subject
              ? 'Try modifying your search query or subject filters to locate materials.'
              : 'Be the first to create content on OpenEd!'
          }
        />
      );
    }

    switch (activeTab) {
      case 'notes':
        return <NoteList notes={data} />;
      case 'guides':
        return <GuideList guides={data} />;
      case 'questions':
        return <QuestionList questions={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        
        {/* Main top controls bar */}
        {activeTab !== 'auth' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-card border border-border p-4 rounded-lg shadow-sm">
            <div className="md:col-span-2">
              <SearchBar onSearch={handleSearchSubmit} initialValue={search} placeholder="Filter materials..." />
            </div>
            <div>
              <select
                id="explore-subject-select"
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-input bg-card text-sm focus:outline-none cursor-pointer"
              >
                <option value="">All Subjects</option>
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex border-b border-border gap-2 overflow-x-auto">
          {(['notes', 'guides', 'questions'] as ExploreTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap capitalize transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'notes' && <FileText className="h-4 w-4" />}
              {tab === 'guides' && <BookOpen className="h-4 w-4" />}
              {tab === 'questions' && <HelpCircle className="h-4 w-4" />}
              <span>{tab}</span>
            </button>
          ))}

          {!isAuthenticated && (
            <button
              onClick={() => handleTabChange('auth')}
              className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap ml-auto capitalize transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'auth'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Register / Login</span>
            </button>
          )}
        </div>

        {/* Main List Rendering OR Auth forms */}
        {activeTab === 'auth' && !isAuthenticated ? (
          <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 md:p-8 shadow-md">
            {isLoginTab ? (
              <LoginForm onSuccess={() => navigate('/dashboard')} onToggleForm={() => setIsLoginTab(false)} />
            ) : (
              <RegisterForm onSuccess={() => navigate('/dashboard')} onToggleForm={() => setIsLoginTab(true)} />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {renderContentList()}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};
export default ExplorePage;
