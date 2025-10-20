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

export async function generateReplies(input: string, tone: ToneType, mode: GenerationMode = 'standard'): Promise<Reply[]> {
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

  const modeInstructions = mode === 'unfiltered' 
    ? `⚠️ UNFILTERED MODE: Be BOLD, RAW, and UNHINGED. No holding back. Maximum creativity and edge. Think like you're texting your closest friend who gets your dark humor. Push boundaries while staying clever.`
    : `Maintain appropriate boundaries while being authentic and creative.`;

  const prompt = `You are the ULTIMATE comeback generator. Your replies are legendary - sharp, authentic, and memorable.

${modeInstructions}

Message received: "${input}"

Generate 3 KILLER comeback replies with the "${tone}" vibe (${selectedTone}).

CRITICAL RULES:
- Write like a REAL PERSON texting, NOT a corporate bot
- Be spontaneous, natural, and FEARLESS
- Use modern slang, casual language, texting style
- Make each reply UNIQUE and MEMORABLE
- Keep it 1-2 sentences MAX (real text message length)
- Add personality and ATTITUDE
- Use emojis ONLY if they enhance the vibe (don't overdo it)
- NO polite filler unless the tone demands it
- ${mode === 'unfiltered' ? 'GO ALL OUT - be as bold and edgy as the tone requires' : 'Be bold but tasteful'}

For "${tone}" specifically:
${tone === 'savage' ? '- Destroy them. Show no mercy. Make it HURT.' : ''}
${tone === 'unhinged' ? '- Complete chaos. Make them go "wtf did I just read?"' : ''}
${tone === 'flirty' ? '- Playful seduction. Make them smile and blush.' : ''}
${tone === 'sarcastic' ? '- Drip with irony. Make it STING.' : ''}

Format as JSON:
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
        temperature: mode === 'unfiltered' ? 1.0 : 0.85,
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

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.replies as Reply[];
  } catch (error) {
    console.error('Error generating replies:', error);
    
    // Better fallback replies - all different
    const fallbacks: Record<ToneType, Reply[]> = {
      savage: [
        { tone, text: "That's cute. Try again when you have something interesting to say.", explanation: "Dismissive and cutting" },
        { tone, text: "Did you practice that in the mirror or does mediocrity just come naturally?", explanation: "Questions their effort" },
        { tone, text: "I'd explain it to you but I left my crayons at home.", explanation: "Implies they're simple" }
      ],
      flirty: [
        { tone, text: "Is that your best line? Gonna need to try harder than that 😏", explanation: "Playful challenge" },
        { tone, text: "Interesting opener... I'll give you one more shot to impress me", explanation: "Creates intrigue" },
        { tone, text: "Cute attempt but I've heard better from my Uber driver 😘", explanation: "Teasing comparison" }
      ],
      sarcastic: [
        { tone, text: "Wow, riveting stuff. Really. I'm on the edge of my seat.", explanation: "Dripping with sarcasm" },
        { tone, text: "Oh how original. Nobody's EVER said that before 🙄", explanation: "Mocking originality" },
        { tone, text: "Fascinating. Tell me more about how wrong you are.", explanation: "False interest" }
      ],
      funny: [
        { tone, text: "Haha wait are you being serious rn 😭", explanation: "Natural disbelief" },
        { tone, text: "LMAOOO not this again bro please", explanation: "Casual dismissal" },
        { tone, text: "Bro really woke up and chose violence huh", explanation: "Self-aware humor" }
      ],
      bold: [
        { tone, text: "I'm gonna need you to rephrase that. Now.", explanation: "Direct command" },
        { tone, text: "Not doing this today. Next topic.", explanation: "Firm boundary" },
        { tone, text: "Respectfully, absolutely not.", explanation: "Polite but firm" }
      ],
      witty: [
        { tone, text: "That's one way to demonstrate you've never won an argument.", explanation: "Clever observation" },
        { tone, text: "Fascinating theory. Where'd you get it, a cereal box?", explanation: "Questions source wittily" },
        { tone, text: "I appreciate the effort but your logic has left the chat.", explanation: "Playful logic critique" }
      ],
      unhinged: [
        { tone, text: "LMAOOO NOT YOU SAYING THIS 💀💀💀 I CAN'T", explanation: "Chaotic disbelief" },
        { tone, text: "Bestie really thought this was it 😭😭 the AUDACITY", explanation: "Dramatic reaction" },
        { tone, text: "Sir/ma'am this is a Wendy's what are you ON about 💀", explanation: "Absurd deflection" }
      ],
      professional: [
        { tone, text: "I appreciate your input. Let's schedule time to discuss this properly.", explanation: "Polished redirect" },
        { tone, text: "Thank you for sharing. I'll review and get back to you.", explanation: "Professional delay" },
        { tone, text: "Interesting perspective. Let's explore this during our next meeting.", explanation: "Diplomatic postponement" }
      ],
      casual: [
        { tone, text: "lol idk man that sounds kinda weird to me", explanation: "Relaxed disagreement" },
        { tone, text: "yeah nah not really feeling that tbh", explanation: "Chill rejection" },
        { tone, text: "haha nice try but imma pass", explanation: "Friendly decline" }
      ],
      mysterious: [
        { tone, text: "Interesting... but you're missing something important.", explanation: "Creates intrigue" },
        { tone, text: "You really think that's all there is to it? 🤔", explanation: "Hints at more" },
        { tone, text: "If only you knew what I know...", explanation: "Cryptic superiority" }
      ],
      mature: [
        { tone, text: "I hear what you're saying. Let's talk about this when we're both calm.", explanation: "Measured response" },
        { tone, text: "I understand your perspective, though I see it differently.", explanation: "Respectful disagreement" },
        { tone, text: "That's worth discussing. Let me think about it and get back to you.", explanation: "Thoughtful delay" }
      ],
      mixed: [
        { tone, text: "Haha okay but like... why though? 🤔", explanation: "Balanced casual question" },
        { tone, text: "Interesting take. Not sure I agree but I respect it.", explanation: "Mixed acknowledgment" },
        { tone, text: "lol that's one way to look at it I guess", explanation: "Neutral observation" }
      ]
    };
    
    return fallbacks[tone] || fallbacks.mixed;
  }
}
