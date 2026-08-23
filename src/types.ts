export type StoryLanguage = 'English' | 'Myanmar';
export type PromptLanguage = 'English' | 'Myanmar' | 'Same as Story';
export type TargetAge = '3-5' | '6-8' | '9-12';
export type VideoCategory = 'Sing' | 'Story' | 'Knowledge';

export interface CharacterBible {
  id: string;
  name: string;
  age: string;
  species: string;
  gender: string;
  height: string;
  bodyProportions: string;
  face: string;
  hair: string;
  eyes: string;
  skinFur: string;
  clothing: string;
  shoes: string;
  accessories: string;
  personality: string;
  voice: string;
  typicalExpressions: string;
  colorPalette: string;
  animationStyle: string;
  importantVisualIdentifiers: string;
  imagePrompt?: string; // 360 reference prompt
  closeUpPrompt?: string; // face reference prompt
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  storyPurpose: string;
  duration: string;
  location: string;
  time: string;
  charactersInScene: string[];
  characterActions: string;
  facialExpressions: string;
  dialogue: string;
  narration: string;
  environment: string;
  props: string;
  cameraShot: string;
  cameraMovement: string;
  lighting: string;
  animationDirection: string;
  soundEffects: string;
  musicMood: string;
  videoPrompt: string;
}

export interface StoryIdea {
  id: string;
  title: string;
  oneLineConcept: string;
  shortSynopsis: string;
  mainCharacters: string[];
  setting: string;
  moralLesson: string;
  suggestedDuration: string;
}

export interface Project {
  id: string;
  title: string;
  category: VideoCategory;
  language: StoryLanguage;
  promptLanguage: PromptLanguage;
  targetAge: TargetAge;
  duration: string;
  animationStyle: string;
  storyIdea?: StoryIdea;
  characters: CharacterBible[];
  scenes: Scene[];
  consistencyReport?: {
    isConsistent: boolean;
    issues: string[];
    correctionsMade: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  geminiApiKey: string;
  model: string;
  defaultLanguage: StoryLanguage;
  defaultAge: TargetAge;
  defaultAnimationStyle: string;
  defaultDuration: string;
  promptLanguage: PromptLanguage;
  theme: 'dark' | 'light' | 'system';
}
