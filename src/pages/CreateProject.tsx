import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Sparkles, Loader2, Wand2, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { generateContent } from '../services/ai';
import { AI_SYSTEM_INSTRUCTION, PROJECT_SCHEMA } from '../services/aiPrompts';
import { Project, StoryLanguage, TargetAge, PromptLanguage, VideoCategory } from '../types';

const steps = ['Details', 'Idea', 'Generating'];

export function CreateProject() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { settings, addProject } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generationStage, setGenerationStage] = useState('');

  // Form State
  const [language, setLanguage] = useState<StoryLanguage>(settings.defaultLanguage);
  const [age, setAge] = useState<TargetAge>(settings.defaultAge);
  const [duration, setDuration] = useState(settings.defaultDuration);
  const [animationStyle, setAnimationStyle] = useState(settings.defaultAnimationStyle);
  const [promptLanguage, setPromptLanguage] = useState<PromptLanguage>(settings.promptLanguage);
  const [idea, setIdea] = useState('');

  const displayCategory = category === 'sing' ? 'Kids Sing' : category === 'story' ? 'Kids Story' : 'Kids Knowledge';
  const c = category as VideoCategory;

  const handleGenerate = async () => {
    if (!settings.geminiApiKey) {
      setError('Please configure your Gemini API Key in Settings first.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    setCurrentStep(2);

    try {
      setGenerationStage('Understanding idea & creating story structure...');
      const prompt = `
        Category: ${displayCategory}
        Story Language: ${language}
        Prompt Language: ${promptLanguage}
        Target Age: ${age}
        Desired Duration: ${duration}
        Animation Style: ${animationStyle}
        User Idea/Topic: ${idea || 'Generate a strong original concept automatically.'}
      `;

      setGenerationStage('Building Character Bible & locking consistency...');
      
      const result = await generateContent({
        prompt,
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        schema: PROJECT_SCHEMA,
      });

      setGenerationStage('Finalizing scenes & video prompts...');

      const newProject: Project = {
        id: crypto.randomUUID(),
        title: result.storyIdea.title,
        category: c,
        language,
        promptLanguage,
        targetAge: age,
        duration,
        animationStyle,
        storyIdea: result.storyIdea,
        characters: result.characters,
        scenes: result.scenes,
        consistencyReport: result.consistencyReport,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      addProject(newProject);
      navigate(`/project/${newProject.id}`);

    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
      setIsGenerating(false);
      setCurrentStep(1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-20 md:pb-0">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </button>

      <div className="glass-card p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-indigo-500/20 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </span>
            Create {displayCategory} Video
          </h1>
          
          <div className="flex items-center gap-2 mt-6">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx <= currentStep 
                      ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    idx <= currentStep ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full ${
                    idx < currentStep ? 'bg-indigo-600' : 'bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-8">
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="glass-input">
                    <option value="English">English</option>
                    <option value="Myanmar">Myanmar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Age</label>
                  <select value={age} onChange={(e) => setAge(e.target.value as any)} className="glass-input">
                    <option value="3-5">3 - 5 Years</option>
                    <option value="6-8">6 - 8 Years</option>
                    <option value="9-12">9 - 12 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="glass-input">
                    <option value="30 seconds">30 seconds</option>
                    <option value="1 minute">1 minute</option>
                    <option value="2 minutes">2 minutes</option>
                    <option value="3 minutes">3 minutes</option>
                    <option value="5 minutes">5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Animation Style</label>
                  <input 
                    type="text" 
                    value={animationStyle} 
                    onChange={(e) => setAnimationStyle(e.target.value)} 
                    className="glass-input"
                    placeholder="e.g. Cute 3D Animation"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => setCurrentStep(1)} className="primary-button">
                  Next Step <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Story Idea or Topic (Optional)
                </label>
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="glass-input min-h-[120px] resize-y"
                  placeholder="e.g. A brave little robot learning to share with friends..."
                />
                <p className="text-xs text-slate-500 mt-2">Leave blank to let AI suggest a strong original concept automatically.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prompt Language (For Video Generators)</label>
                <select value={promptLanguage} onChange={(e) => setPromptLanguage(e.target.value as any)} className="glass-input">
                  <option value="English">English (Recommended for most models)</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Same as Story">Same as Story</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                <button onClick={() => setCurrentStep(0)} className="text-slate-400 hover:text-white font-medium text-sm">
                  Back
                </button>
                <button onClick={handleGenerate} className="primary-button bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                  <Wand2 className="w-5 h-5 mr-2" /> Generate Project
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mt-8 mb-2">AI is Director is Working...</h3>
              <p className="text-indigo-300 font-medium animate-pulse">{generationStage}</p>
              <p className="text-slate-500 text-sm mt-4 max-w-md">
                This may take a minute. The AI is crafting the story, designing characters, mapping scenes, and generating production-ready prompts.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
