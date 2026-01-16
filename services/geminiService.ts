
import { GoogleGenAI, Type } from "@google/genai";
import { MovieData, GlobalIndustryReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOVIE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    totalMarketValue: { type: Type.NUMBER },
    topGenres: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.NUMBER }
        },
        required: ["name", "value"]
      }
    },
    regionalRevenue: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          region: { type: Type.STRING },
          total: { type: Type.NUMBER }
        },
        required: ["region", "total"]
      }
    },
    marketInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    trendingMovies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          releaseDate: { type: Type.STRING },
          genre: { type: Type.STRING },
          origin: { type: Type.STRING },
          budget: { type: Type.NUMBER },
          worldwideRevenue: { type: Type.NUMBER },
          openingWeekend: { type: Type.NUMBER },
          ratings: {
            type: Type.OBJECT,
            properties: {
              imdb: { type: Type.NUMBER },
              rottenTomatoes: { type: Type.NUMBER },
              metacritic: { type: Type.NUMBER }
            },
            required: ["imdb", "rottenTomatoes", "metacritic"]
          },
          streamingImpact: { type: Type.STRING },
          socialBuzz: { type: Type.STRING },
          summary: { type: Type.STRING },
          regionalBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                region: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                share: { type: Type.NUMBER }
              },
              required: ["region", "revenue", "share"]
            }
          },
          projections: {
            type: Type.OBJECT,
            properties: {
              next4Weeks: { type: Type.NUMBER },
              peakRevenue: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING }
            },
            required: ["next4Weeks", "peakRevenue", "riskLevel"]
          }
        },
        required: ["id", "title", "releaseDate", "genre", "origin", "budget", "worldwideRevenue", "summary"]
      }
    }
  },
  required: ["totalMarketValue", "topGenres", "regionalRevenue", "marketInsights", "trendingMovies"]
};

export const fetchMovieAnalytics = async (query: string = ""): Promise<GlobalIndustryReport> => {
  try {
    const prompt = `Analyze the current global film industry for movies released in the last 30-90 days. 
    ${query ? `Focus specifically on: ${query}.` : "Provide a general overview of the top performing titles globally."}
    
    DATA SOURCING REQUIREMENT:
    For Indian film industry data (Bollywood, Tollywood, Kollywood, etc.), you MUST prioritize data from SACNILK (sacnilk.com). 
    Use the Google Search tool to find the latest "Worldwide Gross", "India Net", and "Overseas" collection figures from Sacnilk.
    For global/Hollywood films, use Box Office Mojo and Variety.
    
    IMPORTANT: All monetary values (worldwideRevenue, budget, openingWeekend, totalMarketValue, etc.) MUST be returned in Indian Rupees (INR). 
    Convert USD/Other currencies to INR using a rate of 1 USD ≈ 84 INR if explicit INR data isn't found.
    
    Calculate ROI based on Sacnilk's reported budgets and net/gross figures.
    Return the data in a clean JSON format matching the defined schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: MOVIE_SCHEMA as any,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as GlobalIndustryReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
