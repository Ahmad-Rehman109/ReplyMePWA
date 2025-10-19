export type ToneType = 'funny' | 'bold' | 'mature' | 'savage' | 'flirty' | 'sarcastic' | 'professional' | 'casual' | 'witty' | 'unhinged' | 'mysterious' | 'mixed';

export interface Reply {
  text: string;
  explanation: string;
  tone: ToneType;
}

export interface Generation {
  id: string;
  timestamp: number;
  input: string;
  tone: ToneType;
  replies: Reply[];
  isFavorite?: boolean;
}

export interface Template {
  id: string;
  category: 'dating' | 'friends' | 'trending';
  title: string;
  scenario: string;
  suggestedTone: ToneType;
  icon: string;
}
