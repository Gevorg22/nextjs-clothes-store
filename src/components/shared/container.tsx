import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  className?: string;
  children?: ReactNode;
}

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn('mx-auto max-w-[1280px]', className)}>{children}</div>;
};
