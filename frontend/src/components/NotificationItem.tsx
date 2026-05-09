import React from 'react';
import { Link } from 'react-router-dom';

const typeConfig: Record<string, { icon: string; classes: string; border: string }> = {
  success: { icon: 'check', classes: 'bg-emerald-500/10 text-emerald-500', border: 'border-emerald-500/20' },
  error:   { icon: 'x',     classes: 'bg-red-500/10 text-red-500', border: 'border-red-500/20' },
  warning: { icon: 'alert', classes: 'bg-amber-500/10 text-amber-500', border: 'border-amber-500/20' },
  info:    { icon: 'info',  classes: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20' },
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
    if (name === 'check') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
    if (name === 'x') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>;
    if (name === 'alert') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

export const NotificationItem: React.FC<{
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const config = typeConfig[notification.type] ?? typeConfig.info;

  return (
    <div className={`glass-card rounded-2xl p-5 flex gap-5 transition-all duration-300 hover:border-white/10 ${
      notification.read ? 'opacity-50 grayscale-[0.5]' : 'border-l-4 border-l-primary-500'
    }`}>
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${config.classes} ${config.border}`}>
        <Icon name={config.icon} className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4 mb-1">
          <p className={`text-sm leading-relaxed ${notification.read ? 'text-slate-400' : 'text-white font-semibold'}`}>
            {notification.message}
          </p>
          <span className="shrink-0 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">
            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2">
            {notification.jobId && (
              <Link
                to={`/jobs/${notification.jobId}`}
                className="text-[10px] font-black text-primary-400 hover:text-primary-300 uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                View Target Job
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </Link>
            )}
            
            <div className="flex items-center gap-2 ml-auto">
              {!notification.read && (
                <button
                  className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/10 transition-all"
                  onClick={() => onMarkAsRead(notification._id)}
                >
                  Resolve
                </button>
              )}
              <button
                className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/10 transition-all"
                onClick={() => onDelete(notification._id)}
              >
                Dismiss
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;