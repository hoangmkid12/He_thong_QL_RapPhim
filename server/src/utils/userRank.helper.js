/**
 * Determines membership rank based on points
 * @param {number} points - tong_diem_tich_luy
 * @returns {string} - 'DONG' | 'BAC' | 'VANG' | 'BACH_KIM'
 */
const calculateRank = (points) => {
  if (points >= 10000) return 'BACH_KIM';
  if (points >= 5000)  return 'VANG';
  if (points >= 1000)  return 'BAC';
  return 'DONG';
};

/**
 * Updates a user's rank if it has changed
 * @param {Object} conn - database connection/query object
 * @param {number} userId - user ID
 * @param {number} totalPoints - current total points
 */
const updateRankIfChanged = async (conn, userId, totalPoints) => {
  const newRank = calculateRank(totalPoints);
  await conn.execute(
    'UPDATE taikhoan SET hang_thanh_vien = ? WHERE id = ?',
    [newRank, userId]
  );
  return newRank;
};

module.exports = { calculateRank, updateRankIfChanged };
