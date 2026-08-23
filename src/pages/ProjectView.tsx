import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Copy, CheckCircle2, FileText, Users, Image as ImageIcon, Film, PlaySquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useStore((state) => state.getProject(id!));
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!project) {
    return <div className="p-8 text-center text-slate-400">Project not found.</div>;
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CopyButton = ({ text, id }: { text: string, id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="glass-button py-1.5 px-3 text-xs bg-slate-800/50 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 transition-colors shrink-0"
    >
      {copiedId === id ? (
        <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Copied</>
      ) : (
        <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
      )}
    </button>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'image-prompts', label: 'Image Prompts', icon: ImageIcon },
    { id: 'scenes', label: 'Scenes', icon: Film },
    { id: 'video-prompts', label: 'Video Prompts', icon: PlaySquare },
    { id: 'consistency', label: 'Consistency', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full pb-24 md:pb-0 h-full flex flex-col">
      <header className="mb-6 shrink-0">
        <button 
          onClick={() => navigate('/projects')}
          className="mb-4 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/20 capitalize">{project.category} Video</span>
              <span>•</span>
              <span>{project.duration}</span>
              <span>•</span>
              <span>Ages {project.targetAge}</span>
              <span>•</span>
              <span>{project.animationStyle}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const allVideoPrompts = project.scenes.map(s => `Scene ${s.sceneNumber}:\n${s.videoPrompt}`).join('\n\n');
                handleCopy(allVideoPrompts, 'all-video-prompts');
              }}
              className="glass-button bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/40"
            >
              {copiedId === 'all-video-prompts' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy All Video Prompts
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 shrink-0 border-b border-glass-border pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">One-Line Concept</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{project.storyIdea?.oneLineConcept}</p>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                    <p className="text-slate-300 leading-relaxed">{project.storyIdea?.shortSynopsis}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Setting</h3>
                    <p className="text-white">{project.storyIdea?.setting}</p>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Moral Lesson</h3>
                    <p className="text-indigo-300 font-medium">{project.storyIdea?.moralLesson}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.characters.map((char, i) => (
                  <div key={i} className="glass-card p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{char.name}</h3>
                        <p className="text-indigo-300 text-sm">{char.species} • {char.gender} • Age {char.age}</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Visual Identifiers</span>
                        <p className="text-sm text-slate-300">{char.importantVisualIdentifiers}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500 block">Clothing</span><span className="text-slate-200">{char.clothing}</span></div>
                        <div><span className="text-slate-500 block">Hair/Fur</span><span className="text-slate-200">{char.hair || char.skinFur}</span></div>
                        <div><span className="text-slate-500 block">Personality</span><span className="text-slate-200">{char.personality}</span></div>
                        <div><span className="text-slate-500 block">Palette</span><span className="text-slate-200">{char.colorPalette}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'image-prompts' && (
              <div className="space-y-6">
                {project.characters.map((char, i) => (
                  <div key={i} className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-glass-border pb-2">
                      {char.name} - Turnaround Reference
                    </h3>
                    <div className="bg-slate-900/50 rounded-xl p-4 relative group font-mono text-sm text-slate-300">
                      <p>{char.imagePrompt}</p>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={char.imagePrompt || ''} id={`img-prompt-${i}`} />
                      </div>
                    </div>
                    
                    {char.closeUpPrompt && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Close-up Portrait</h4>
                        <div className="bg-slate-900/50 rounded-xl p-4 relative group font-mono text-sm text-slate-300">
                          <p>{char.closeUpPrompt}</p>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyButton text={char.closeUpPrompt || ''} id={`cu-prompt-${i}`} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-6">
                {project.scenes.map((scene, i) => (
                  <div key={i} className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/50" />
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-bold">SCENE {scene.sceneNumber}</span>
                          <span className="text-slate-400 text-xs">{scene.time} • {scene.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{scene.title}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="text-xs text-slate-500 uppercase font-bold mb-2">Action & Expressions</h4>
                        <p className="text-sm text-slate-300 mb-4">{scene.characterActions}</p>
                        
                        <h4 className="text-xs text-slate-500 uppercase font-bold mb-2">Dialogue / Narration</h4>
                        <div className="bg-slate-800/30 rounded-lg p-3 text-sm italic text-slate-300 border-l-2 border-indigo-500/30">
                          {scene.dialogue || scene.narration || "No dialogue."}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs text-slate-500 uppercase font-bold mb-1">Camera</h4>
                          <p className="text-sm text-slate-300">{scene.cameraShot} • {scene.cameraMovement}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-slate-500 uppercase font-bold mb-1">Environment & Lighting</h4>
                          <p className="text-sm text-slate-300">{scene.environment}</p>
                          <p className="text-xs text-slate-400 mt-1">{scene.lighting}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-slate-500 uppercase font-bold mb-1">Audio</h4>
                          <p className="text-sm text-slate-300">{scene.soundEffects}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'video-prompts' && (
              <div className="space-y-6">
                {project.scenes.map((scene, i) => (
                  <div key={i} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-3 border-b border-glass-border pb-2">
                      <h3 className="font-semibold text-white">Scene {scene.sceneNumber}</h3>
                      <CopyButton text={scene.videoPrompt} id={`vid-prompt-${i}`} />
                    </div>
                    <p className="font-mono text-sm text-slate-300 leading-relaxed p-2 bg-slate-900/50 rounded-lg">
                      {scene.videoPrompt}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'consistency' && project.consistencyReport && (
              <div className="glass-card p-8 text-center max-w-2xl mx-auto">
                {project.consistencyReport.isConsistent ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Consistency Lock Verified</h3>
                    <p className="text-slate-400 text-sm">All scenes correctly reference the Character Bible. Locations and visual styles are maintained throughout the production plan.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Consistency Adjusted</h3>
                    <p className="text-slate-400 text-sm mb-6">The AI detected and corrected inconsistencies during generation.</p>
                    
                    <div className="w-full text-left space-y-4">
                      {project.consistencyReport.issues?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Detected Issues:</h4>
                          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                            {project.consistencyReport.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                          </ul>
                        </div>
                      )}
                      {project.consistencyReport.correctionsMade?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-400 mb-2">Corrections Made:</h4>
                          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                            {project.consistencyReport.correctionsMade.map((corr, i) => <li key={i}>{corr}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
