type ParsedRecipe = {
    summary: string;
    instructions: string;
    ingredients: string;
    totalCost: number;
    totalTime: number;
  };
  
  export function parseRecipeText(text: string): ParsedRecipe {
    const summary = text.match(/SUMMARY:\s*([\s\S]*?)\nINSTRUCTIONS:/)?.[1]?.trim() || '';
    const instructions = text.match(/INSTRUCTIONS:\s*([\s\S]*?)\nINGREDIENTS:/)?.[1]?.trim() || '';
    const ingredients = text.match(/INGREDIENTS:\s*([\s\S]*?)\nCOST:/)?.[1]?.trim() || '';
    const cost = parseInt(text.match(/COST:\s*(\d+)/)?.[1] || '0');
    const time = parseInt(text.match(/TIME:\s*(\d+)/)?.[1] || '0');
  
    return {
      summary,
      instructions,
      ingredients,
      totalCost: cost,
      totalTime: time,
    };
  }



export default async function extractRecipeFromYoutube(youtubeLink: string) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a recipe extractor from YouTube video descriptions."
          },
          {
            role: "user",
            content: `Given this YouTube link: ${youtubeLink}, extract the following details from the video description or subtitles:
          
          1. INGREDIENTS: List all the ingredients mentioned in the video.
          2. COST: Estimate the total cost of the ingredients based on average prices for the ingredients in a typical grocery store.
          3. TIME: Estimate the total time required to make the recipe (e.g., preparation time and cooking time).
          4. INSTRUCTIONS: List the steps involved in the recipe, formatted as numbered steps (1. Step 1, 2. Step 2, ...).
          
          Return the extracted information in a structured format like this:
          
          INGREDIENTS: [List of ingredients]
          COST: [Estimated cost of ingredients]
          TIME: [Estimated total time to prepare and cook]
          INSTRUCTIONS:
          1. [Step 1]
          2. [Step 2]
          3. [Step 3]
          ...
          `
          }
        ],
      })
    });
  
    const result = await res.json();
    const text = result.choices?.[0]?.message?.content || "";
  
    const parsed = parseRecipeText(text); // 파싱 함수 분리하면 더 좋음
  
    return parsed;
  }
  


  