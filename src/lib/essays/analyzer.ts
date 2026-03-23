// Essay analysis engine — rule-based feedback system

export interface EssayAnalysis {
  overallScore: number; // 0-100
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  paragraphCount: number;
  readingLevel: string;
  categories: AnalysisCategory[];
  suggestions: Suggestion[];
  strengths: string[];
}

export interface AnalysisCategory {
  name: string;
  score: number; // 0-100
  label: string;
  icon: string;
  feedback: string;
}

export interface Suggestion {
  type: 'warning' | 'tip' | 'improvement';
  title: string;
  detail: string;
}

// --- Weak / filler words ---
const WEAK_WORDS = [
  'very', 'really', 'just', 'quite', 'basically', 'actually', 'literally',
  'definitely', 'honestly', 'totally', 'absolutely', 'simply', 'stuff',
  'things', 'got', 'nice', 'good', 'great', 'amazing', 'awesome',
  'interesting', 'important',
];

const CLICHE_PHRASES = [
  'since i was a child',
  'ever since i was young',
  'i have always wanted',
  'i have always been passionate',
  'from a young age',
  'changed my life',
  'made me who i am',
  'taught me a valuable lesson',
  'in today\'s society',
  'at the end of the day',
  'think outside the box',
  'pushed me out of my comfort zone',
  'Webster\'s dictionary defines',
  'throughout my life',
  'i believe that',
  'in conclusion',
];

const STRONG_VERBS = [
  'achieved', 'built', 'created', 'designed', 'developed', 'discovered',
  'established', 'forged', 'generated', 'implemented', 'initiated',
  'launched', 'navigated', 'orchestrated', 'pioneered', 'resolved',
  'spearheaded', 'transformed', 'uncovered', 'volunteered', 'cultivated',
  'advocated', 'collaborated', 'mentored', 'researched',
];

const SENSORY_WORDS = [
  'bright', 'cold', 'warm', 'sharp', 'soft', 'loud', 'quiet', 'bitter',
  'sweet', 'rough', 'smooth', 'glowing', 'dark', 'shimmering', 'crisp',
  'whisper', 'echo', 'scent', 'fragrance', 'taste', 'burning', 'icy',
  'thunder', 'crack', 'hum', 'buzz', 'tremble', 'ache', 'pulse',
];

const TRANSITION_WORDS = [
  'however', 'moreover', 'furthermore', 'consequently', 'nevertheless',
  'meanwhile', 'although', 'therefore', 'additionally', 'instead',
  'similarly', 'ultimately', 'specifically', 'indeed', 'notably',
  'conversely', 'regardless', 'subsequently',
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
}

function getParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
}

function countOccurrences(text: string, words: string[]): { word: string; count: number }[] {
  const lower = text.toLowerCase();
  const results: { word: string; count: number }[] = [];
  for (const word of words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      results.push({ word, count: matches.length });
    }
  }
  return results;
}

function countPhraseOccurrences(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter(phrase => lower.includes(phrase));
}

// --- Category scorers ---

function scoreLength(wordCount: number): AnalysisCategory {
  let score: number;
  let feedback: string;

  if (wordCount === 0) {
    score = 0;
    feedback = 'Paste your essay above to get started!';
  } else if (wordCount < 150) {
    score = 20;
    feedback = `At ${wordCount} words, your essay is very short. Most college essays are 250-650 words. Keep developing your ideas.`;
  } else if (wordCount < 250) {
    score = 40;
    feedback = `At ${wordCount} words, you're getting started but could use more depth. Aim for 500-650 words.`;
  } else if (wordCount < 400) {
    score = 60;
    feedback = `Good progress at ${wordCount} words. Consider expanding your key moments with more detail.`;
  } else if (wordCount < 500) {
    score = 75;
    feedback = `Solid length at ${wordCount} words. You have room to add a bit more depth if needed.`;
  } else if (wordCount <= 650) {
    score = 95;
    feedback = `Perfect length at ${wordCount} words! This is the sweet spot for Common App essays.`;
  } else if (wordCount <= 700) {
    score = 80;
    feedback = `At ${wordCount} words, you're slightly over the 650-word limit. Look for places to tighten.`;
  } else {
    score = 50;
    feedback = `At ${wordCount} words, you're well over the 650-word limit. You'll need to cut significantly.`;
  }

  return {
    name: 'Length',
    score,
    label: score >= 80 ? 'Great' : score >= 50 ? 'Developing' : 'Needs Work',
    icon: '📏',
    feedback,
  };
}

function scoreOpeningHook(text: string): AnalysisCategory {
  const sentences = getSentences(text);
  if (sentences.length === 0) {
    return { name: 'Opening Hook', score: 0, label: 'N/A', icon: '🎣', feedback: 'No text to analyze.' };
  }

  const firstSentence = sentences[0].toLowerCase();
  const firstTwoSentences = sentences.slice(0, 2).join(' ').toLowerCase();
  let score = 50; // baseline
  const notes: string[] = [];

  // Penalize generic openings
  if (firstSentence.startsWith('my name is') || firstSentence.startsWith('i am')) {
    score -= 20;
    notes.push('Avoid starting with "My name is" or "I am" — admissions readers already know who you are.');
  }

  // Check for cliche openings
  const clicheStart = CLICHE_PHRASES.some(p => firstTwoSentences.includes(p));
  if (clicheStart) {
    score -= 15;
    notes.push('Your opening uses a common cliche. Try starting with a specific moment or detail.');
  }

  // Reward: starts with action/scene/dialogue
  if (firstSentence.match(/^["']/) || firstSentence.match(/^[a-z].*said/i)) {
    score += 20;
    notes.push('Starting with dialogue is an effective hook!');
  }

  // Reward: starts with vivid/sensory detail
  const hasSensory = SENSORY_WORDS.some(w => firstSentence.includes(w));
  if (hasSensory) {
    score += 15;
    notes.push('Great use of sensory language in your opening.');
  }

  // Reward: short punchy opener (< 15 words)
  const firstWordCount = firstSentence.split(/\s+/).length;
  if (firstWordCount <= 12 && firstWordCount > 2) {
    score += 10;
    notes.push('Short, punchy opening — nice!');
  }

  // Reward: question opener
  if (text.trim().split(/[.!?]/)[0] && text.trim().indexOf('?') < 100 && text.trim().indexOf('?') > 0) {
    score += 5;
    notes.push('Opening with a question can engage the reader.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Opening Hook',
    score,
    label: score >= 80 ? 'Compelling' : score >= 50 ? 'Decent' : 'Needs Work',
    icon: '🎣',
    feedback: notes.length > 0 ? notes.join(' ') : 'Your opening is serviceable. Consider starting with a specific moment, image, or line of dialogue to immediately draw readers in.',
  };
}

function scoreWordChoice(text: string): AnalysisCategory {
  const wordCount = countWords(text);
  if (wordCount === 0) {
    return { name: 'Word Choice', score: 0, label: 'N/A', icon: '✏️', feedback: 'No text to analyze.' };
  }

  let score = 60;
  const notes: string[] = [];

  // Weak words penalty
  const weakFound = countOccurrences(text, WEAK_WORDS);
  const totalWeak = weakFound.reduce((s, w) => s + w.count, 0);
  const weakRatio = totalWeak / wordCount;

  if (weakRatio > 0.05) {
    score -= 20;
    const topWeak = weakFound.sort((a, b) => b.count - a.count).slice(0, 3).map(w => `"${w.word}" (${w.count}x)`);
    notes.push(`High use of filler words: ${topWeak.join(', ')}. Try replacing them with more specific language.`);
  } else if (weakRatio > 0.02) {
    score -= 5;
    const topWeak = weakFound.sort((a, b) => b.count - a.count).slice(0, 2).map(w => `"${w.word}"`);
    notes.push(`Watch out for filler words like ${topWeak.join(', ')}.`);
  } else if (totalWeak === 0 && wordCount > 100) {
    score += 10;
    notes.push('Minimal filler words — strong, precise language.');
  }

  // Strong verbs reward
  const strongFound = countOccurrences(text, STRONG_VERBS);
  if (strongFound.length >= 3) {
    score += 15;
    notes.push('Great use of strong, active verbs!');
  } else if (strongFound.length >= 1) {
    score += 5;
    notes.push('Some strong verbs used. Try to incorporate more action-oriented language.');
  }

  // Sensory language reward
  const sensoryFound = countOccurrences(text, SENSORY_WORDS);
  if (sensoryFound.length >= 3) {
    score += 10;
    notes.push('Vivid sensory details bring your essay to life.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Word Choice',
    score,
    label: score >= 80 ? 'Strong' : score >= 50 ? 'Developing' : 'Needs Work',
    icon: '✏️',
    feedback: notes.length > 0 ? notes.join(' ') : 'Consider using more vivid, specific language to make your essay stand out.',
  };
}

function scoreStructure(text: string): AnalysisCategory {
  const paragraphs = getParagraphs(text);
  const sentences = getSentences(text);
  const wordCount = countWords(text);

  if (wordCount === 0) {
    return { name: 'Structure & Flow', score: 0, label: 'N/A', icon: '🏗️', feedback: 'No text to analyze.' };
  }

  let score = 50;
  const notes: string[] = [];

  // Paragraph count
  if (paragraphs.length >= 3 && paragraphs.length <= 7) {
    score += 15;
    notes.push(`${paragraphs.length} paragraphs — well-organized structure.`);
  } else if (paragraphs.length < 2) {
    score -= 15;
    notes.push('Your essay appears to be one large block. Break it into paragraphs for readability.');
  } else if (paragraphs.length > 8) {
    score -= 5;
    notes.push(`${paragraphs.length} paragraphs is a lot. Consider combining some for better flow.`);
  }

  // Sentence length variety
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  if (sentenceLengths.length >= 3) {
    const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((acc, l) => acc + (l - mean) ** 2, 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 5) {
      score += 15;
      notes.push('Excellent sentence length variety — creates natural rhythm.');
    } else if (stdDev > 3) {
      score += 5;
      notes.push('Decent sentence variety. Mix in some shorter sentences for impact.');
    } else {
      score -= 10;
      notes.push('Your sentences are similar lengths. Vary between short, punchy and longer, flowing sentences.');
    }
  }

  // Transitions
  const transitionFound = countOccurrences(text, TRANSITION_WORDS);
  if (transitionFound.length >= 3) {
    score += 10;
    notes.push('Good use of transitions to connect ideas.');
  } else if (wordCount > 200 && transitionFound.length === 0) {
    score -= 5;
    notes.push('Consider adding transition words (however, moreover, instead) to improve flow.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Structure & Flow',
    score,
    label: score >= 80 ? 'Well-Organized' : score >= 50 ? 'Developing' : 'Needs Work',
    icon: '🏗️',
    feedback: notes.join(' '),
  };
}

function scoreVoice(text: string): AnalysisCategory {
  const wordCount = countWords(text);
  if (wordCount === 0) {
    return { name: 'Authenticity & Voice', score: 0, label: 'N/A', icon: '🎭', feedback: 'No text to analyze.' };
  }

  let score = 55;
  const notes: string[] = [];

  // Check for first person usage (good — it's a personal essay)
  const firstPerson = (text.match(/\bI\b/g) || []).length;
  const firstPersonRatio = firstPerson / wordCount;
  if (firstPersonRatio > 0.06) {
    score -= 10;
    notes.push('Very high "I" usage. Try varying your sentence structure so not every sentence starts with "I".');
  } else if (firstPerson > 0) {
    score += 5;
    notes.push('Good use of first person — this feels personal.');
  }

  // Check for cliches
  const clichesFound = countPhraseOccurrences(text, CLICHE_PHRASES);
  if (clichesFound.length >= 3) {
    score -= 20;
    notes.push(`Multiple cliched phrases detected (${clichesFound.length}). Replace with your own authentic language.`);
  } else if (clichesFound.length > 0) {
    score -= 8;
    notes.push(`Cliche detected: "${clichesFound[0]}". Try expressing this in your own words.`);
  } else if (wordCount > 200) {
    score += 10;
    notes.push('No common cliches found — your voice feels authentic.');
  }

  // Dialogue / quotes (shows storytelling)
  const hasDialogue = text.includes('"') || text.includes('\u201C');
  if (hasDialogue) {
    score += 10;
    notes.push('Including dialogue makes your essay more engaging and personal.');
  }

  // Specific details (numbers, proper nouns)
  const specificDetails = (text.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || []).length;
  if (specificDetails > 5) {
    score += 10;
    notes.push('Good use of specific names and details — this helps readers visualize your story.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Authenticity & Voice',
    score,
    label: score >= 80 ? 'Authentic' : score >= 50 ? 'Developing' : 'Generic',
    icon: '🎭',
    feedback: notes.length > 0 ? notes.join(' ') : 'Your essay could feel more personal. Add specific memories, dialogue, and details only you could write.',
  };
}

function scoreClarity(text: string): AnalysisCategory {
  const sentences = getSentences(text);
  const wordCount = countWords(text);

  if (wordCount === 0) {
    return { name: 'Clarity', score: 0, label: 'N/A', icon: '💡', feedback: 'No text to analyze.' };
  }

  let score = 65;
  const notes: string[] = [];

  // Very long sentences
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 35);
  if (longSentences.length > 0) {
    score -= longSentences.length * 8;
    notes.push(`${longSentences.length} sentence(s) over 35 words. Long sentences can lose readers — try splitting them.`);
  }

  // Passive voice detection (simple heuristic)
  const passiveMatches = text.match(/\b(was|were|been|being|is|are)\s+\w+ed\b/gi) || [];
  if (passiveMatches.length > 3) {
    score -= 10;
    notes.push('Frequent passive voice detected. Active voice ("I built" vs "it was built") is more engaging.');
  } else if (passiveMatches.length === 0 && wordCount > 100) {
    score += 10;
    notes.push('Mostly active voice — your writing is direct and engaging.');
  }

  // Repeated words (excluding common words)
  const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const repeated = Object.entries(wordFreq)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (repeated.length > 0) {
    score -= repeated.length * 5;
    const repeatedStr = repeated.map(([w, c]) => `"${w}" (${c}x)`).join(', ');
    notes.push(`Repeated words: ${repeatedStr}. Vary your vocabulary.`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Clarity',
    score,
    label: score >= 80 ? 'Clear' : score >= 50 ? 'Decent' : 'Needs Work',
    icon: '💡',
    feedback: notes.length > 0 ? notes.join(' ') : 'Your writing is reasonably clear. Keep sentences concise and use active voice.',
  };
}

// --- Suggestion generator ---
function generateSuggestions(analysis: Omit<EssayAnalysis, 'suggestions' | 'strengths'>): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (analysis.wordCount > 650) {
    suggestions.push({
      type: 'warning',
      title: 'Over word limit',
      detail: `You're at ${analysis.wordCount} words. The Common App limit is 650. Look for redundant sentences, filler words, and passages that don't serve your main story.`,
    });
  }

  if (analysis.wordCount > 0 && analysis.wordCount < 250) {
    suggestions.push({
      type: 'warning',
      title: 'Essay is too short',
      detail: 'Most successful essays are 500-650 words. Expand on your key moments with more detail, reflection, and insight.',
    });
  }

  if (analysis.paragraphCount <= 1 && analysis.wordCount > 100) {
    suggestions.push({
      type: 'improvement',
      title: 'Add paragraph breaks',
      detail: 'Breaking your essay into 4-6 paragraphs makes it much easier to read. Start a new paragraph when you shift to a new idea or moment.',
    });
  }

  if (analysis.avgSentenceLength > 25) {
    suggestions.push({
      type: 'tip',
      title: 'Shorten your sentences',
      detail: `Your average sentence is ${Math.round(analysis.avgSentenceLength)} words. Mix in some sentences under 10 words for impact and rhythm.`,
    });
  }

  const lowCategories = analysis.categories.filter(c => c.score < 50);
  for (const cat of lowCategories) {
    suggestions.push({
      type: 'improvement',
      title: `Improve: ${cat.name}`,
      detail: cat.feedback,
    });
  }

  if (analysis.wordCount >= 400 && analysis.wordCount <= 650 && lowCategories.length === 0) {
    suggestions.push({
      type: 'tip',
      title: 'Read it aloud',
      detail: 'Your essay is looking solid. Read it aloud to catch awkward phrasing and hear the natural rhythm of your writing.',
    });
  }

  return suggestions;
}

function generateStrengths(categories: AnalysisCategory[], wordCount: number): string[] {
  const strengths: string[] = [];

  const strong = categories.filter(c => c.score >= 75);
  for (const cat of strong) {
    strengths.push(`${cat.icon} ${cat.name}: ${cat.label}`);
  }

  if (wordCount >= 500 && wordCount <= 650) {
    strengths.push('📏 Perfect word count for Common App');
  }

  return strengths;
}

// --- Main analyzer ---
export function analyzeEssay(text: string): EssayAnalysis {
  const wordCount = countWords(text);
  const sentences = getSentences(text);
  const paragraphs = getParagraphs(text);

  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const paragraphCount = paragraphs.length;

  // Reading level estimate (simple Flesch-based heuristic)
  const syllableEstimate = wordCount * 1.3; // rough average
  let readingLevel = 'N/A';
  if (wordCount > 50) {
    const avgSyl = syllableEstimate / wordCount;
    const fleschGrade = 0.39 * avgSentenceLength + 11.8 * avgSyl - 15.59;
    if (fleschGrade >= 13) readingLevel = 'College-level';
    else if (fleschGrade >= 10) readingLevel = 'Advanced';
    else if (fleschGrade >= 8) readingLevel = 'Intermediate';
    else readingLevel = 'Basic';
  }

  const categories: AnalysisCategory[] = [
    scoreLength(wordCount),
    scoreOpeningHook(text),
    scoreWordChoice(text),
    scoreStructure(text),
    scoreVoice(text),
    scoreClarity(text),
  ];

  const overallScore = wordCount === 0 ? 0 :
    Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  const partial = {
    overallScore,
    wordCount,
    sentenceCount,
    avgSentenceLength,
    paragraphCount,
    readingLevel,
    categories,
  };

  return {
    ...partial,
    suggestions: generateSuggestions(partial),
    strengths: generateStrengths(categories, wordCount),
  };
}
