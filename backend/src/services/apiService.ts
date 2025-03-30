import axios, { AxiosError } from 'axios';
import { TeamDocument, MatchDocument, PlayerDocument } from '../types';

const API_BASE_URL = 'https://api.football-data.org/v4';
const BARCELONA_TEAM_ID = 81; // Correct team ID
const API_KEY = process.env.API_FOOTBALL_KEY || '773082eceec8419da05290841f97196b';

const getHeaders = () => ({
  headers: {
    'X-Auth-Token': API_KEY
  }
});

// ✅ Fetch Barcelona Team Info
export const fetchBarcelonaTeamInfo = async (): Promise<TeamDocument | null> => {
  const url = `${API_BASE_URL}/teams/${BARCELONA_TEAM_ID}`;
  console.log("🔍 Fetching from API:", url);

  try {
    const response = await axios.get(url, getHeaders());
    console.log("📌 Full API Response:", response.data);

    return response.data || null;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ API Football team error:", axiosError.response?.data || axiosError.message);
    return null;
  }
};

// ✅ Fetch Matches (Scheduled & Finished)
export const fetchMatches = async (status: 'SCHEDULED' | 'FINISHED', count = 5): Promise<MatchDocument[]> => {
  const url = `${API_BASE_URL}/teams/${BARCELONA_TEAM_ID}/matches?status=${status}&limit=${count}`;
  console.log("🔍 Fetching from API:", url);

  try {
    const response = await axios.get(url, getHeaders());
    console.log(`📌 Matches API Response (${status}):`, response.data.matches.length);

    return response.data.matches.map((match: any) => ({
      matchId: match.id,
      utcDate: match.utcDate,
      status: match.status,
      matchday: match.matchday,
      competition: match.competition.name,
      stage: match.stage,
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        crest: match.homeTeam.crest // Ensure crest is available
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        crest: match.awayTeam.crest // Ensure crest is available
      },
      score: {
        fullTime: match.score.fullTime || { home: null, away: null },
        halfTime: match.score.halfTime || { home: null, away: null },
      },
      lastUpdated: new Date(match.lastUpdated),
    }));
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ API Football matches error:", axiosError.response?.data || axiosError.message);
    return [];
  }
};

// ✅ Fetch Players (Squad)
export const fetchPlayers = async (): Promise<PlayerDocument[]> => {
  const url = `${API_BASE_URL}/teams/${BARCELONA_TEAM_ID}`;
  console.log("🔍 Fetching from API:", url);

  try {
    const response = await axios.get(url, getHeaders());
    return response.data.squad || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ API Football players error:", axiosError.response?.data || axiosError.message);
    return [];
  }
};

// ✅ Fetch Team Stats
export const fetchTeamStats = async () => {
  const url = `${API_BASE_URL}/competitions/PD/standings`;
  console.log("🔍 Fetching from API:", url);

  try {
    const response = await axios.get(url, getHeaders());
    const standings = response.data.standings[0]?.table || [];

    // Find Barcelona's stats from the standings table
    const barcaStats = standings.find((team: any) => team.team.id === BARCELONA_TEAM_ID);

    if (!barcaStats) {
      console.warn("⚠️ Barcelona not found in standings.");
      return null;
    }

    return {
      leaguePosition: barcaStats.position,
      points: barcaStats.points,
      goalsScored: barcaStats.goalsFor,
      goalsAgainst: barcaStats.goalsAgainst,
      goalDifference: barcaStats.goalDifference,
      lastUpdated: new Date()
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ API Football team stats error:", axiosError.response?.data || axiosError.message);
    return null;
  }
};

// ✅ Fetch League Standings
export const fetchSeasonPerformance = async () => {
  const url = `${API_BASE_URL}/competitions/PD/standings`;
  console.log("🔍 Fetching from API:", url);

  try {
    const response = await axios.get(url, getHeaders());
    const standings = response.data.standings[0]?.table || [];

    const barcaStats = standings.find((team: any) => team.team.id === BARCELONA_TEAM_ID);

    if (!barcaStats) {
      console.warn("⚠️ Barcelona not found in season standings.");
      return null;
    }

    return {
      points: barcaStats.points,
      position: barcaStats.position,  
      wins: barcaStats.won,
      draws: barcaStats.draw,
      losses: barcaStats.lost,// Need to calculate from match results
      goalsFor: barcaStats.goalsFor,
      goalsAgainst: barcaStats.goalsAgainst,
      goalDifference : barcaStats.goalDifference,
      form: barcaStats.form?.split(",") || [], // Some APIs provide form as a string
      lastUpdated: new Date()
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("❌ API Football season performance error:", axiosError.response?.data || axiosError.message);
    return null;
  }
};

// ✅ Fetch Squad Health (Custom Logic)
export const fetchSquadHealth = async () => {
  console.log(`🔍 Fetching Squad Health (Manual Placeholder)`);
  
  // No direct API support, needs manual tracking of injuries/suspensions
  return {
    availablePlayers: 22, // Placeholder value
    injuredPlayers: [],
    suspendedPlayers: [],
    positionAvailability: {
      defenders: { available: 5, total: 7 },
      midfielders: { available: 6, total: 8 },
      forwards: { available: 5, total: 7 }
    },
    lastUpdated: new Date()
  };
};
