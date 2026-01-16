
export interface RegionalPerformance {
  region: string;
  revenue: number;
  share: number;
}

export interface MovieRatings {
  imdb: number;
  rottenTomatoes: number;
  metacritic: number;
}

export interface MovieData {
  id: string;
  title: string;
  releaseDate: string;
  genre: string;
  origin: string; // Hollywood, Bollywood, etc.
  budget: number;
  worldwideRevenue: number;
  openingWeekend: number;
  ratings: MovieRatings;
  streamingImpact: string;
  socialBuzz: 'High' | 'Medium' | 'Low';
  regionalBreakdown: RegionalPerformance[];
  summary: string;
  projections: {
    next4Weeks: number;
    peakRevenue: number;
    riskLevel: 'High' | 'Medium' | 'Low';
  };
}

export interface GlobalIndustryReport {
  totalMarketValue: number;
  topGenres: { name: string; value: number }[];
  regionalRevenue: { region: string; total: number }[];
  marketInsights: string[];
  trendingMovies: MovieData[];
}
