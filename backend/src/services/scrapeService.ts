import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const FBREF_URL = 'https://fbref.com/en/squads/206d90db/2024-2025/all_comps/Barcelona-Stats-All-Competitions';
const CACHE_FILE_PATH = path.join(__dirname, '../data/teamStats.json');

interface CachedTeamStats {
  stats: Record<string, any[]>;
  lastUpdated: string; // ISO string format
}

export const scrapeTeamStats = async (): Promise<CachedTeamStats> => {
  try {
    console.log(`Scraping data from: ${FBREF_URL}`);

    const response = await fetch(FBREF_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.text();
    const $ = cheerio.load(body);

    const tableIds = [
      'stats_standard_combined',  // All competitions
      'stats_standard_12',       // La Liga
      'stats_standard_8'         // Champions League
    ];

    const tablesData: Record<string, any[]> = {};

    for (const tableId of tableIds) {
      const table = $(`#${tableId}`);
      if (table.length === 0) {
        console.warn(`⚠️ Table ${tableId} not found - skipping`);
        tablesData[tableId] = [];
        continue;
      }

      // Extract headers
      const headers: string[] = [];
      table.find('thead tr').last().find('th').each((_, el) => {
        headers.push($(el).text().trim().replace(/\s+/g, ' '));
      });

      // Extract rows
      const rows: any[] = [];
      table.find('tbody tr').each((_, row) => {
        const rowData: Record<string, string> = {};
        $(row).find('td, th').each((i, cell) => {
          const header = headers[i] || `col_${i}`;
          rowData[header] = $(cell).text().trim().replace(/\s+/g, ' ');
        });
        rows.push(rowData);
      });

      tablesData[tableId] = rows;
    }

    const dataToCache: CachedTeamStats = {
      stats: tablesData,
      lastUpdated: new Date().toISOString()
    };

    // Save data to JSON file
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(dataToCache, null, 2));
    console.log('✅ Data saved to cache');

    return dataToCache;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getCachedTeamStats = (): CachedTeamStats | null => {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const rawData = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      return JSON.parse(rawData);
    }
    return null;
  } catch (error) {
    console.error('❌ Error reading cache:', error);
    return null;
  }
};

// Helper function to check if data is outdated
export const isTeamStatsOutdated = (lastUpdated: string): boolean => {
  const hoursPassed = (new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60);
  return hoursPassed >= 24;
};