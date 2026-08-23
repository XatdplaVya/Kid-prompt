import React from 'react';
import { motion } from 'motion/react';
import { Music, BookOpen, Brain, Lightbulb, UserPlus, Film, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../components/Layout';

const mainCategories = [
  { id: 'sing', title: 'Kids Sing', icon: Music, color: 'from-pink-500 to-rose-500', path: '/create/sing', description: 'Create animated music videos for children.' },
  { id: 'story', title: 'Kids Story', icon: BookOpen, color: 'from-indigo-500 to-purple-500', path: '/create/story', description: 'Generate original storybooks and animations.' },
  { id: 'knowledge', title: 'Kids Knowledge', icon: Brain, color: 'from-emerald-500 to-teal-500', path: '/create/knowledge', description: 'Educational content adapted to specific age groups.' },
];

const quickTools = [
  { title: 'Story Ideas', icon: Lightbulb, path: '/tools/ideas' },
  { title: 'Character Creator', icon: UserPlus, path: '/tools/character' },
  { title: 'Scene Generator', icon: Film, path: '/tools/scenes' },
  { title: 'Reference Video', icon: Video, path: '/tools/reference' },
];

export function Home() {
  const projects = useStore((state) => state.projects);
  const recentProjects = projects.slice(0, 3); // Get 3 most recent

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 pb-20 md:pb-0"
    >
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Welcome back to the Studio
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Create original animated kids videos with AI. Start a new project or continue where you left off.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
          Create New Project
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.path}
                className="glass-card p-6 flex flex-col items-start gap-4 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group block h-full"
              >
                <div className={cn("p-4 rounded-2xl bg-gradient-to-br shadow-inner text-white", cat.color)}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{cat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Creating <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" />
          Quick Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTools.map((tool, i) => (
            <Link
              key={tool.title}
              to={tool.path}
              className="glass-card p-4 flex flex-col items-center justify-center gap-3 hover:bg-glass-hover transition-colors text-center group"
            >
              <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <tool.icon className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="font-medium text-slate-300 text-sm">{tool.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {recentProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full inline-block" />
              Recent Projects
            </h2>
            <Link to="/projects" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="glass-card p-5 hover:border-indigo-500/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-white truncate max-w-[200px]">{project.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 capitalize">{project.category} Video • {new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
