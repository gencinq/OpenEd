import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SUBJECTS, Subject } from '@shared/constants';
import { ArrowRight, BookOpen, GraduationCap, Search, FileText, HelpCircle, Users } from 'lucide-react';
import SearchBar from '../components/shared/SearchBar';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    navigate(`/explore?q=${encodeURIComponent(q)}`);
  };

  const selectSubject = (subject: Subject) => {
    navigate(`/explore?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Premium Hero Section with Indigo-Violet Gradient */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-background border-b border-border">
        {/* Background gradient blur effects */}
        <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 text-center max-w-4xl relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-6 animate-fade-in">
            <GraduationCap className="h-4 w-4" />
            <span>OpenEd Educational MVP v1.0</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            Share Knowledge,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Learn Together
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The collaborative education platform. Read peer notes, study guides, and ask academic questions in a mobile-first student network.
          </p>

          <div className="mt-8 max-w-lg mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search anything... e.g. Quantum Mechanics" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="h-10 px-6 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-1.5 transition-colors shadow-sm"
            >
              Start Exploring <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="h-10 px-6 rounded-md border border-input bg-card hover:bg-muted text-foreground font-medium text-sm flex items-center transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature stats summary section */}
      <section className="py-12 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
              <FileText className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1,200+</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Study Notes</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
              <BookOpen className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">450+</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Guides</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
              <HelpCircle className="h-6 w-6 text-violet-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">800+</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Q&A Threads</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">3,500+</div>
              <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Browsing Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Browse by Subject</h2>
            <p className="text-sm text-muted-foreground">Select a discipline below to browse curated study materials</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => selectSubject(subject)}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 hover:border-indigo-300 transition-all text-center focus:outline-none flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-semibold text-foreground line-clamp-1">{subject}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
