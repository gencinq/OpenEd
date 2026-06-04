import React from 'react';

interface SubjectTagProps {
  subject: string;
}

// Consistent colors for each subject
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
  Physics: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-100 dark:border-sky-900/50',
  Chemistry: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
  Biology: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-100 dark:border-green-900/50',
  'Computer Science': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
  History: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
  Geography: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-100 dark:border-teal-900/50',
  English: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
  Economics: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/50',
  Philosophy: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-100 dark:border-violet-900/50',
  Psychology: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
  Engineering: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-100 dark:border-orange-900/50',
  Medicine: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-100 dark:border-red-900/50',
  Law: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  Business: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/50',
  Art: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-900/50',
  Music: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400 border-pink-100 dark:border-pink-900/50',
  Other: 'bg-muted text-muted-foreground border-border'
};

export const SubjectTag: React.FC<SubjectTagProps> = ({ subject }) => {
  const colorClass = SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other;

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${colorClass}`}>
      {subject}
    </span>
  );
};
export default SubjectTag;
