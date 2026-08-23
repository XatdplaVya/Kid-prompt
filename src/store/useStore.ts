import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, Project, StoryLanguage, TargetAge, VideoCategory, PromptLanguage } from '../types';

interface StoreState {
  settings: AppSettings;
  projects: Project[];
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, projectUpdate: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  clearLocalData: () => void;
}

const defaultSettings: AppSettings = {
  geminiApiKey: '',
  model: 'gemini-2.5-flash',
  defaultLanguage: 'English',
  defaultAge: '3-5',
  defaultAnimationStyle: 'Pixar-inspired family animation feel',
  defaultDuration: '1 minute',
  promptLanguage: 'English',
  theme: 'dark',
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      projects: [],
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),
      updateProject: (id, projectUpdate) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...projectUpdate, updatedAt: Date.now() } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      getProject: (id) => get().projects.find((p) => p.id === id),
      clearLocalData: () => set({ projects: [], settings: defaultSettings }),
    }),
    {
      name: 'kidzprompt-storage',
    }
  )
);
