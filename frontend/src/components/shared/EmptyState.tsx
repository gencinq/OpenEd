import React, { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <HelpCircle className="h-10 w-10 text-muted-foreground/60" />,
  action
}) => {
  return (
    <div className="flex flex-col items-center text-center p-8 border border-dashed border-border rounded-lg bg-muted/20 my-4 max-w-md mx-auto">
      <div className="p-3 bg-muted rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
export default EmptyState;
