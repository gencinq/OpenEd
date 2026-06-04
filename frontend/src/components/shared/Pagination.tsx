import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-card hover:bg-muted text-muted-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm text-muted-foreground font-medium px-2">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-card hover:bg-muted text-muted-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
export default Pagination;
