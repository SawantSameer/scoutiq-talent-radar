export type Sport = 'Football' | 'Basketball' | 'Athletics';

export type FootballStats = {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
};

export type BasketballStats = {
  threePoint: number;
  midRange: number;
  ballHandling: number;
  defense: number;
  rebounding: number;
  athleticism: number;
};

export type AthleticsStats = {
  speed: number;
  stamina: number;
  strength: number;
  agility: number;
  technique: number;
  consistency: number;
};

export type AthleteStats = FootballStats | BasketballStats | AthleticsStats;

export type Athlete = {
  id: string;
  name: string;
  sport: Sport;
  position: string;
  age: number;
  nationality: string;
  stats: AthleteStats;
  score: number; // 0–100, derived as weighted average of stats
};

export type DiscoverStackParamList = {
  DiscoverFeed: undefined;
  Profile: { athleteId: string };
};

export type RootTabParamList = {
  Discover: undefined;
  Shortlist: undefined;
};
