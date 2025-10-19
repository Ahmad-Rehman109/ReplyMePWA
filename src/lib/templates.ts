import type { Template } from '../types';

export const templates: Template[] = [
  // Dating category
  {
    id: 'date-1',
    category: 'dating',
    title: 'First Date Follow-up',
    scenario: 'Had a great time last night! Would love to see you again soon.',
    suggestedTone: 'bold',
    icon: '💕'
  },
  {
    id: 'date-2',
    category: 'dating',
    title: 'Running Late',
    scenario: "I'm so sorry, running about 15 minutes late!",
    suggestedTone: 'mature',
    icon: '⏰'
  },
  {
    id: 'date-3',
    category: 'dating',
    title: 'Making Plans',
    scenario: 'What are you up to this weekend?',
    suggestedTone: 'funny',
    icon: '📅'
  },
  {
    id: 'date-4',
    category: 'dating',
    title: 'Compliment Response',
    scenario: "You looked amazing tonight 😍",
    suggestedTone: 'bold',
    icon: '✨'
  },
  
  // Friends category
  {
    id: 'friend-1',
    category: 'friends',
    title: 'Cancel Plans',
    scenario: "Hey, I'm not feeling well. Can we reschedule?",
    suggestedTone: 'mature',
    icon: '🤒'
  },
  {
    id: 'friend-2',
    category: 'friends',
    title: 'Group Chat Banter',
    scenario: "Who's down for pizza tonight?",
    suggestedTone: 'funny',
    icon: '🍕'
  },
  {
    id: 'friend-3',
    category: 'friends',
    title: 'Need Advice',
    scenario: "Can I get your opinion on something?",
    suggestedTone: 'mature',
    icon: '💭'
  },
  {
    id: 'friend-4',
    category: 'friends',
    title: 'Birthday Thanks',
    scenario: 'Thanks so much for the birthday wishes!',
    suggestedTone: 'funny',
    icon: '🎂'
  },
  
  // Trending category
  {
    id: 'trend-1',
    category: 'trending',
    title: 'Awkward Silence Breaker',
    scenario: "It's been a while! How have you been?",
    suggestedTone: 'mixed',
    icon: '👋'
  },
  {
    id: 'trend-2',
    category: 'trending',
    title: 'Work Message',
    scenario: "Can you send me that file when you get a chance?",
    suggestedTone: 'mature',
    icon: '💼'
  },
  {
    id: 'trend-3',
    category: 'trending',
    title: 'Thanks for Gift',
    scenario: 'I loved the gift! You know me so well!',
    suggestedTone: 'bold',
    icon: '🎁'
  },
  {
    id: 'trend-4',
    category: 'trending',
    title: 'Networking Follow-up',
    scenario: "Great meeting you at the event! Let's stay in touch.",
    suggestedTone: 'mature',
    icon: '🤝'
  },
];
