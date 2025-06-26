import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, HelpCircle, Info, AlertTriangle } from 'lucide-react';

interface CalloutBoxProps {
  type: 'success' | 'warning' | 'info' | 'question' | 'caution';
  children: React.ReactNode;
  className?: string;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  question: HelpCircle,
  caution: AlertCircle,
};

export const CalloutBox: React.FC<CalloutBoxProps> = ({ type, children, className }) => {
  const Icon = icons[type];

  const colors = {
    success: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
    warning: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
    info: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
    question: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' },
    caution: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700' },
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border-l-4 flex items-start',
      colors[type].bg,
      colors[type].border,
      colors[type].text,
      className
    )}>
      <Icon className="mr-3 h-5 w-5 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};