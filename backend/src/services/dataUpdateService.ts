// import Match from '../models/Match';
// import Player from '../models/Player';
// import SeasonPerformance from '../models/SeasonPerformance';
// import TeamStats from '../models/TeamStats';
// import { fetchAPIData } from './apiService';

// export const updateAllData = async () => {
//   try {
//     const apiData = await fetchAPIData(); // You'll need to implement this
    
//     // Update Matches
//     await Match.bulkWrite(
//       apiData.matches.map(match => ({
//         updateOne: {
//           filter: { matchId: match.matchId },
//           update: { $set: match },
//           upsert: true
//         }
//       }))
//     );

//     // Update Players
//     await Player.bulkWrite(
//       apiData.players.map(player => ({
//         updateOne: {
//           filter: { id: player.id },
//           update: { $set: player },
//           upsert: true
//         }
//       }))
//     );

//     // Update Season Performance
//     if (apiData.seasonPerformance) {
//       await SeasonPerformance.findOneAndUpdate(
//         {},
//         apiData.seasonPerformance,
//         { upsert: true, new: true }
//       );
//     }

//     console.log('Database updated successfully');
//   } catch (error) {
//     console.error('Error updating data:', error);
//     throw error;
//   }
// };