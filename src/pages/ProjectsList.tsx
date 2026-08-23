import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { FolderOpen, ArrowRight, Trash2, Video, BookOpen, Music, Brain } from 'lucide-react';

export function ProjectsList() {
  const { projects, deleteProject } = useStore();

  const getIcon = (category: string) => {
    switch (category) {
      case 'sing': return Music;
      case 'story': return BookOpen;
      case 'knowledge': return Brain;
      default: return Video;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto w-full pb-20 md:pb-0"
    >
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-3 rounded-xl">
            <FolderOpen className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-slate-400">All your generated video concepts and scripts.</p>
          </div>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No projects yet</h2>
          <p className="text-slate-400 mb-6 max-w-md">You haven't generated any projects yet. Go back to the home screen and create your first animated video concept.</p>
          <Link to="/" className="primary-button">
            Go to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const Icon = getIcon(project.category);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="glass-card p-6 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-indigo-500/20 transition-colors text-slate-400 group-hover:text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm('Delete this project?')) deleteProject(project.id);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.storyIdea?.shortSynopsis}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 capitalize">{project.category}</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{project.duration}</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{project.scenes.length} Scenes</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-glass-border">
                    <Link 
                      to={`/project/${project.id}`}
                      className="flex items-center justify-between text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors w-full"
                    >
                      Open Project <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
