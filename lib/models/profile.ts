export type ChromosomeType = 'XX' | 'XY' | 'XXY';
export type UnitSystem = 'metric' | 'imperial';
export type WeightType = 'precise' | 'range';
export type GoalType = 'cut' | 'neutral' | 'bulk';

export type SummaryTint = 'systemGreen' | 'systemBlue' | 'systemOrange' | 'systemRed' | 'systemPink';

export interface UserProfile {
  chromosome: ChromosomeType | null;
  unit: UnitSystem;
  age: number | null;
  weight: string | null;
  weightType: WeightType;
  height: string | null;
  goal: GoalType;
}

export interface ChromosomeOption {
  value: ChromosomeType;
  label: string;
  symbol: string;
  tint: SummaryTint;
}

export interface GoalOption {
  value: GoalType;
  label: string;
  subtitle: string;
  emoji: string;
}

// Default empty profile
export const DEFAULT_PROFILE: UserProfile = {
  chromosome: null,
  unit: 'metric',
  age: null,
  weight: null,
  weightType: 'precise',
  height: null,
  goal: 'neutral',
};

// Static options (from seed_user_setup.json)
export const CHROMOSOME_OPTIONS: ChromosomeOption[] = [
  { value: 'XX', label: 'XX', symbol: '♀', tint: 'systemPink' },
  { value: 'XY', label: 'XY', symbol: '♂', tint: 'systemBlue' },
  { value: 'XXY', label: 'XXY+', symbol: '☿', tint: 'systemGreen' },
];

export const GOAL_OPTIONS: GoalOption[] = [
  { value: 'cut', label: 'Cut', subtitle: 'Lose weight & reduce body fat', emoji: '📉' },
  { value: 'neutral', label: 'Neutral', subtitle: 'Maintain current weight', emoji: '⚖️' },
  { value: 'bulk', label: 'Bulk', subtitle: 'Gain muscle & build strength', emoji: '📈' },
];

// Tint to colour mapping
export const TINT_COLORS: Record<SummaryTint, string> = {
  systemGreen: '#34C759',
  systemBlue: '#007AFF',
  systemOrange: '#FF9500',
  systemRed: '#FF3B30',
  systemPink: '#FF2D55',
};
