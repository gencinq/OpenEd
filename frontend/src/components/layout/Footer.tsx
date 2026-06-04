import React from 'react';

interface FooterProps {
  id?: string;
}

export const Footer: React.FC<FooterProps> = ({ id = 'app-footer' }) => {
  return (
    <footer id={id} className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-semibold text-foreground">OpenEd</span> — Share Knowledge, Learn Together.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Help</a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} OpenEd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
