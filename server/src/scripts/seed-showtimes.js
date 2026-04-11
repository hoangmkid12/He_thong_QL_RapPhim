const { pool, query, insert, execute } = require('../config/db');

async function seed() {
  try {
    const movieId = 5; // Movie for "Thám tử Kiên"
    
    // 1. Get all cinemas
    const raps = await query('SELECT id, ten_rap FROM rap_chieu');
    if (raps.length === 0) {
      console.log('No cinemas found. Please add cinemas first.');
      process.exit(1);
    }
    
    // 2. Get rooms for each cinema
    const rooms = await query('SELECT id, id_rap, name FROM phongchieu');
    if (rooms.length === 0) {
      console.log('No rooms found. Please add rooms first.');
      process.exit(1);
    }

    console.log(`Seeding showtimes for Movie ID ${movieId} in ${raps.length} cinemas...`);

    // 3. For each cinema, create showtimes for the next 7 days
    for (const rap of raps) {
      const rapRooms = rooms.filter(r => r.id_rap === rap.id);
      if (rapRooms.length === 0) {
        console.log(`Skipping cinema ${rap.ten_rap} (ID: ${rap.id}) - no rooms.`);
        continue;
      }

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // Create a 'lichchieu' (schedule plan) for this movie + cinema + date
        // Note: 'Đã duyệt' is stored as the enum value. In my MySQL, it might be encoded.
        // Let's use the enum string directly if possible, or check what 'Đã duyệt' looks like.
        // From previous query, it showed enum('Ch? duy?t','? duy?t','T? ch?i')
        // Using '? duy?t' (which is probably utf8mb4 for 'Đã duyệt') or 'Đã duyệt'
        const status = 'Đã duyệt'; // This might need adjustment if MySQL encoding is weird
        
        const lcId = await insert(
          'INSERT INTO lichchieu (ma_ke_hoach, id_phim, id_rap, ngay_chieu, trang_thai_duyet) VALUES (?, ?, ?, ?, ?)',
          [`PLAN-${rap.id}-${movieId}-${dateStr}`, movieId, rap.id, dateStr, 'Đã duyệt']
        );

        // Add 4 showtimes for each day
        const times = ['09:00:00', '13:30:00', '18:00:00', '21:30:00'];
        for (const time of times) {
          // Use the first room for simplicity
          await insert(
            'INSERT INTO khung_gio_chieu (id_lich_chieu, id_phong, thoi_gian_chieu) VALUES (?, ?, ?)',
            [lcId, rapRooms[0].id, time]
          );
        }
      }
    }

    console.log('Successfully seeded showtimes for the next 7 days!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();
