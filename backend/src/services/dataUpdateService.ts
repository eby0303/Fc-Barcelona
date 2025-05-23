import Match from '../models/Match';
import SeasonPerformance from '../models/SeasonPerformance';
import { fetchMatches, fetchSeasonPerformance } from '../services/apiService';
import { scrapeTeamStats, isTeamStatsOutdated, getCachedTeamStats } from '../services/scrapeService';

/**
 * Checks if data is older than 24 hours
 */
const isDataOutdated = (lastUpdated: Date): boolean => {
  const hoursPassed = (new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60);
  return hoursPassed >= 24;
};

/**
 * Updates Matches if 24 hours have passed
 */
export const updateMatches = async (): Promise<void> => {
  try {
    const lastMatch = await Match.findOne().sort({ lastUpdated: -1 });

    if (!lastMatch || isDataOutdated(lastMatch.lastUpdated)) {
      console.log("⏳ Updating Matches...");
      
      // Fetch both finished and scheduled matches (5 each)
      const [finishedMatches, scheduledMatches] = await Promise.all([
        fetchMatches('FINISHED', 5),
        fetchMatches('SCHEDULED', 5)
      ]);

      const allMatches = [...finishedMatches, ...scheduledMatches];

      if (allMatches.length > 0) {
        await Match.deleteMany({});
        
        // Add lastUpdated timestamp to each match
        const matchesWithTimestamp = allMatches.map(match => ({
          ...match,
          lastUpdated: new Date()
        }));

        try {
          await Match.insertMany(matchesWithTimestamp);
          console.log(`✅ Matches updated successfully. (${finishedMatches.length} finished, ${scheduledMatches.length} scheduled)`);
        } catch (insertError: any) {
          console.error("❌ Error inserting matches:", insertError.message);
          
          // Log validation errors in more detail
          if (insertError.errors) {
            Object.keys(insertError.errors).forEach(key => {
              console.error(`Validation error for ${key}: ${insertError.errors[key].message}`);
            });
          }
          
          // Try inserting one by one to identify problematic records
          console.log("Attempting to insert matches one by one to identify issues...");
          for (let i = 0; i < matchesWithTimestamp.length; i++) {
            try {
              await new Match(matchesWithTimestamp[i]).save();
            } catch (singleError: any) {
              console.error(`Failed to insert match at index ${i}:`, singleError.message);
              console.error("Problematic match data:", JSON.stringify(matchesWithTimestamp[i], null, 2));
            }
          }
        }
      } else {
        console.log("⚠️ No matches returned from API");
      }
    } else {
      console.log("✅ Matches are up to date.");
    }
  } catch (error) {
    console.error("❌ Error updating matches:", error);
  }
};

/**
 * Updates Season Performance if 24 hours have passed
 */
export const updateSeasonPerformance = async (): Promise<void> => {
  try {
    const lastPerformance = await SeasonPerformance.findOne().sort({ lastUpdated: -1 });

    if (!lastPerformance || isDataOutdated(lastPerformance.lastUpdated)) {
      console.log("⏳ Updating Season Performance...");
      const newPerformance = await fetchSeasonPerformance();

      if (newPerformance) {
        await SeasonPerformance.deleteMany({});
        
        // add the timestamp to the raw API data
        const performanceWithTimestamp = {
          ...newPerformance,
          lastUpdated: new Date()
        };

        await new SeasonPerformance(performanceWithTimestamp).save();
        console.log("✅ Season Performance updated successfully.");
      }
    } else {
      console.log("✅ Season Performance is up to date.");
    }
  } catch (error) {
    console.error("❌ Error updating season performance:", error);
  }
};


export const updateTeamStats = async (): Promise<void> => {
  try {
    const cachedData = getCachedTeamStats();
    
    if (!cachedData || isTeamStatsOutdated(cachedData.lastUpdated)) {
      console.log("⏳ Updating Team Stats...");
      await scrapeTeamStats();
      console.log("✅ Team Stats updated successfully.");
    } else {
      console.log("✅ Team Stats are up to date.");
    }
  } catch (error) {
    console.error("❌ Error updating team stats:", error);
  }
};

/**
 * Runs all update functions
 */
export const updateAllData = async (): Promise<void> => {
  await updateMatches();
  await updateSeasonPerformance();
  await updateTeamStats();
};