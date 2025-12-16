import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn(
      "min-h-screen pb-20 bg-background",
      className
    )}>
      <div className="max-w-lg mx-auto">
        {children}
      </div>
    </main>
  );
}
