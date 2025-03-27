import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Hardcoded URL - replace if needed
const FBREF_URL = 'https://fbref.com/en/squads/206d90db/2024-2025/all_comps/Barcelona-Stats-All-Competitions';

export const scrapeTeamStats = async () => {
  try {
    console.log(`Scraping data from: ${FBREF_URL}`);
    
    // Add browser-like headers to prevent blocking
    const response = await fetch(FBREF_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.text();
    const $ = cheerio.load(body);

    // Tables
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

    return tablesData;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};