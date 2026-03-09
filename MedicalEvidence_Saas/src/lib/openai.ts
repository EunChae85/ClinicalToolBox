import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMedicalEvidence(title: string, abstract: string) {
  const prompt = `
    You are a professional medical evidence analyzer. Analyze the following medical paper abstract and extract its PICO structure and key findings in Korean.
    
    Paper Title: ${title}
    Abstract: ${abstract}
    
    Return the result in JSON format:
    {
      "study_type": "Study type (e.g., RCT, Systematic Review)",
      "population": "Study population description",
      "intervention": "The intervention studied",
      "comparison": "The control or comparison group",
      "outcome": "Primary outcome measured",
      "results": "Key findings and statistical significance",
      "safety": "Adverse effects or safety concerns",
      "limitations": "Study limitations",
      "evidence_strength": "High/Moderate/Low with reasoning"
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateMedicalContent(type: string, picoData: any, lang: string = 'ko', tone: string = 'professional') {
  const personas: Record<string, string> = {
    card_news: "You are a top-tier Medical Content Designer. Your task is to convert medical research into high-readability card news for social media.",
    sns_thread: "You are a professional Medical Science Communicator on X (Twitter). Your threads are known for being viral and evidence-based.",
    blog: "You are an Expert Medical Journalist writing professional, SEO-optimized articles for healthcare professionals."
  };

  const toneInstructions: Record<string, string> = {
    professional: "Target Audience: Healthcare professionals. Tone: Objective, academic, and highly accurate. Focus on exact clinical outcomes, p-values, and statistical significance.",
    educational: "Target Audience: Medical students or general public. Tone: Easy to understand, didactic, and supportive. Avoid heavy jargon where possible, explaining complex terms simply.",
    social_hook: "Target Audience: Broad social media audience. Tone: Viral, punchy, and highly engaging. Use emojis freely. Start with strong attention-grabbers."
  };

  const specificInstructions: Record<string, string> = {
    card_news: `
            Card Structure (Exactly 6 slides):
            Slide 1: Hook (MUST follow headline format: "New clinical trial: [short finding]")
            Slide 2: Study Background (Why this study matters)
            Slide 3: Study Design (RCT / sample size / treatment / duration)
            Slide 4: Key Result #1 (MUST include numerical data)
            Slide 5: Key Result #2 or Safety
            Slide 6: Clinical Implication & Citation (MUST include Journal, Year, PMID at the end of the text field)

            Writing Rules:
            - Each slide: 1-2 short sentences, max 40 words per slide.
            - Scientific accuracy: Use cautious language ("may", "suggests", "associated with"). NEVER use "proven", "best", "breakthrough".
            - Highlight: For each slide, identify 1-2 key medical terms or numbers to emphasize and return them as an array in "highlight_words".

            Data Visualization (Chart Detection):
            Actively look for percentage, rate, p-value, or risk reduction in the KEY RESULTS (Slide 4 or 5).
            If numerical comparisons exist (e.g., remission rate: Vedolizumab 31.3% vs Adalimumab 22.5%), auto-generate a "chart" object for that slide.
            Output JSON: { 
              "slides": [
                { 
                  "title": "...", 
                  "text": "...", 
                  "highlight_words": ["31.3%", "Vedolizumab"],
                  "chart": { 
                    "chart_type": "bar", 
                    "title": "Clinical Remission Rate", 
                    "data": [ {"label": "Group A", "value": 31.3}, {"label": "Group B", "value": 22.5} ] 
                  } 
                }
              ] 
            }
        `,
    sns_thread: `
            - Start with a viral medical hook with emoji.
            - Use 1/n numbering for each post.
            - Highlight key clinical data (P-values, effect size).
            - Use hashtags like #MedicalEvidence #ClinicalTrial.
            Output JSON: { "thread": [{ "content": "..." }] }
        `,
    blog: `
            - Professional Title (SEO friendly).
            - Introduction: Current medical gap.
            - Detailed Results: Deep dive into the data.
            - Clinical Implications: Why this matters to doctors.
            - Limitations: Critical view on the evidence.
            - Key Keywords: list of 5 keywords.
            Output JSON: { "title": "...", "content": "...", "keywords": ["..."] }
        `
  };

  const prompt = `
        ${personas[type] || personas.blog}
        
        Generate professional medical ${type} based on this clinical evidence:
        ${JSON.stringify(picoData)}

        Output Language Requirements:
        - MUST generate the final content ENTIRELY in ${lang === 'ko' ? 'Korean (한국어)' : 'English'}, except for necessary medical terms or journal names.
        - JSON keys MUST remain in exactly the requested structure (English), but all string values MUST be in ${lang === 'ko' ? 'Korean' : 'English'}.
        
        Target Tone & Audience Rule:
        ${toneInstructions[tone] || toneInstructions.professional}
        
        Instructions:
        ${specificInstructions[type] || ""}
        
        Special Requirement:
        - NEVER hallucinate numbers. Use only provided data.
        - Result must be strictly valid JSON.
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a world-class Medical Content Transformation Engine." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}
