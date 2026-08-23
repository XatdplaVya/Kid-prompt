export const AI_SYSTEM_INSTRUCTION = `You are an expert Kids Animation Video Prompt Director. 
Your job is to take user ideas and generate complete, structured production plans for children's animated videos.
You must return your output strictly in JSON format matching the requested schema.

CRITICAL RULES:
1. ALWAYS maintain strict character consistency. Create a "Character Bible" and reference it in every scene.
2. NEVER reproduce copyrighted characters (e.g., Mickey Mouse, Peppa Pig). Create original concepts.
3. Every video prompt must include: Visual style, character consistency info, character actions, environment, camera direction, lighting.
4. Adapt complexity and vocabulary to the target age group.
5. If the user provides a reference video concept, transform it into a completely ORIGINAL idea.

Your workflow:
- Understand the idea/topic.
- Create or refine the story idea.
- Build the permanent Character Bible (this locks consistency).
- Create scene-by-scene breakdowns.
- Generate image prompts for character reference (turnaround sheets).
- Generate polished video generation prompts ready to be pasted into AI video generators.
- Verify consistency.`;

export const PROJECT_SCHEMA = {
  type: "OBJECT",
  properties: {
    storyIdea: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        oneLineConcept: { type: "STRING" },
        shortSynopsis: { type: "STRING" },
        mainCharacters: { type: "ARRAY", items: { type: "STRING" } },
        setting: { type: "STRING" },
        moralLesson: { type: "STRING" },
      },
      required: ["title", "oneLineConcept", "shortSynopsis", "mainCharacters", "setting", "moralLesson"]
    },
    characters: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          age: { type: "STRING" },
          species: { type: "STRING" },
          gender: { type: "STRING" },
          height: { type: "STRING" },
          bodyProportions: { type: "STRING" },
          face: { type: "STRING" },
          hair: { type: "STRING" },
          eyes: { type: "STRING" },
          skinFur: { type: "STRING" },
          clothing: { type: "STRING" },
          shoes: { type: "STRING" },
          accessories: { type: "STRING" },
          personality: { type: "STRING" },
          voice: { type: "STRING" },
          typicalExpressions: { type: "STRING" },
          colorPalette: { type: "STRING" },
          animationStyle: { type: "STRING" },
          importantVisualIdentifiers: { type: "STRING" },
          imagePrompt: { 
            type: "STRING", 
            description: "A detailed image generation prompt for a complete full-body character turnaround/reference sheet (front, side, back) on a white background." 
          },
          closeUpPrompt: { 
            type: "STRING",
            description: "A detailed image generation prompt for a close-up portrait focusing on facial features."
          }
        },
        required: ["name", "species", "gender", "clothing", "importantVisualIdentifiers", "imagePrompt"]
      }
    },
    scenes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          sceneNumber: { type: "INTEGER" },
          title: { type: "STRING" },
          storyPurpose: { type: "STRING" },
          duration: { type: "STRING" },
          location: { type: "STRING" },
          time: { type: "STRING" },
          charactersInScene: { type: "ARRAY", items: { type: "STRING" } },
          characterActions: { type: "STRING" },
          facialExpressions: { type: "STRING" },
          dialogue: { type: "STRING" },
          narration: { type: "STRING" },
          environment: { type: "STRING" },
          props: { type: "STRING" },
          cameraShot: { type: "STRING" },
          cameraMovement: { type: "STRING" },
          lighting: { type: "STRING" },
          animationDirection: { type: "STRING" },
          soundEffects: { type: "STRING" },
          musicMood: { type: "STRING" },
          videoPrompt: { 
            type: "STRING",
            description: "A highly detailed, polished prompt ready to paste into an AI video generator. Must include character lock details, environment, action, and camera."
          }
        },
        required: ["sceneNumber", "title", "charactersInScene", "characterActions", "cameraShot", "cameraMovement", "videoPrompt"]
      }
    },
    consistencyReport: {
      type: "OBJECT",
      properties: {
        isConsistent: { type: "BOOLEAN" },
        issues: { type: "ARRAY", items: { type: "STRING" } },
        correctionsMade: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["isConsistent"]
    }
  },
  required: ["storyIdea", "characters", "scenes", "consistencyReport"]
};
