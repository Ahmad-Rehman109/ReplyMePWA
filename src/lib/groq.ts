import type { ToneType, Reply } from '../types';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function moderateContent(text: string): Promise<boolean> {
  // Simple content moderation
  const inappropriatePatterns = [
    /\b(kill|murder|violence|threat)\b/i,
    /\b(nsfw|explicit)\b/i,
  ];
  
  return !inappropriatePatterns.some(pattern => pattern.test(text));
}

export async function generateReplies(input: string, tone: ToneType): Promise<Reply[]> {
  const toneDescriptions = {
    funny: 'witty, humorous, and light-hearted with clever wordplay',
    bold: 'confident, direct, and assertive without apology',
    mature: 'thoughtful, professional, and empathetic',
    savage: 'brutally honest, cutting, and merciless - absolutely devastating',
    flirty: 'playful, charming, and subtly seductive',
    sarcastic: 'dripping with irony and sharp wit',
    professional: 'polished, diplomatic, and business-appropriate',
    casual: 'relaxed, friendly, and easy-going',
    witty: 'intellectually sharp and cleverly amusing',
    unhinged: 'chaotic, unpredictable, and delightfully insane',
    mysterious: 'enigmatic, intriguing, and subtly cryptic',
    mixed: 'balanced mix of different tones'
  };

  const selectedTone = toneDescriptions[tone] || toneDescriptions.mixed;

  const prompt = `You are a comeback generator that creates REAL, AUTHENTIC text message replies. Your goal is to help people respond with style and personality.

CRITICAL: Write like a REAL PERSON texting, not a robot. Be natural, spontaneous, and UNHINGED when appropriate. Use casual language, slang, and modern texting style. NO corporate speak, NO robotic phrases, NO "I appreciate..." nonsense.

Message received: "${input}"

Generate 3 KILLER comeback replies with the "${tone}" vibe (${selectedTone}).

STYLE REQUIREMENTS:
- Write like you're texting a friend, not writing an essay
- Use natural reactions and emotions
- Be BOLD and UNAPOLOGETIC
- Make it MEMORABLE and punchy
- Keep it 1-2 sentences MAX (like a real text)
- Add personality, attitude, and SPICE
- Use emojis sparingly if they fit the vibe
- NO polite filler words unless the tone calls for it

For each reply, provide:
- The actual reply text (raw, unfiltered, REAL)
- A brief explanation of the strategy

Format your response as JSON:
{
  "replies": [
    {
      "tone": "${tone}",
      "text": "reply text here",
      "explanation": "why this works"
    },
    {
      "tone": "${tone}",
      "text": "reply text here",
      "explanation": "why this works"
    },
    {
      "tone": "${tone}",
      "text": "reply text here",
      "explanation": "why this works"
    }
  ]
}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate replies');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in response');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.replies as Reply[];
  } catch (error) {
    console.error('Error generating replies:', error);
    // Return fallback replies based on tone
    const fallbacks = {
      savage: { text: "That's cute. Try again.", explanation: "Dismissive and cutting" },
      flirty: { text: "Is that your best line? 😏", explanation: "Playful challenge" },
      sarcastic: { text: "Wow, riveting stuff there.", explanation: "Dripping with sarcasm" },
      funny: { text: "Haha wait are you serious rn 😭", explanation: "Natural and casual" },
      bold: { text: "I'm gonna need you to rephrase that.", explanation: "Direct and assertive" },
      witty: { text: "Fascinating. Tell me more about how wrong you are.", explanation: "Sharp and clever" },
      unhinged: { text: "LMAOOO not you saying this 💀💀💀", explanation: "Chaotic energy" },
      professional: { text: "I appreciate your input. Let's discuss further.", explanation: "Polished and diplomatic" },
      casual: { text: "lol idk man sounds weird to me", explanation: "Relaxed and chill" },
      mysterious: { text: "Interesting... but you're missing something.", explanation: "Cryptic and intriguing" },
      mature: { text: "I hear you. Let's talk about this properly.", explanation: "Thoughtful and measured" },
      mixed: { text: "Haha okay but like... why though?", explanation: "Balanced casual response" }
    };
    
    const fallback = fallbacks[tone] || fallbacks.mixed;
    return [
      { tone, ...fallback },
      { tone, ...fallback },
      { tone, ...fallback }
    ];
  }
}
