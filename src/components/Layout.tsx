import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sparkles, Home, Settings, FolderOpen, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: FolderOpen, label: 'Projects', path: '/projects' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Mobile Header */}
      <header className="md:hidden glass-card m-4 rounded-2xl z-10 sticky top-4 flex items-center justify-between p-4 px-6 border-b-0 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            KidzPrompt AI
          </span>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-glass-border bg-slate-950/50 backdrop-blur-3xl z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl shadow-inner shadow-white/5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            KidzPrompt AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
                  isActive ? 'text-white bg-indigo-500/10 border border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:text-slate-200 hover:bg-glass-hover'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn('w-5 h-5 relative z-10 transition-transform group-hover:scale-110', isActive ? 'text-indigo-400' : '')} />
                <span className="font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative z-10 flex flex-col h-[calc(100vh-80px)] md:h-screen">
        <div className="flex-1 p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden glass-card fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around p-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all relative',
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mobile-nav"
                  className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 mb-1 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
