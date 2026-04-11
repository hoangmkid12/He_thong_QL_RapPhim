/**
 * migrate-passwords.js
 * Chạy một lần: hash toàn bộ password plain text trong DB sang bcrypt
 * Usage: node src/scripts/migrate-passwords.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
  });

  console.log('🔄 Bắt đầu migration mật khẩu...');
  const [users] = await conn.execute('SELECT id, user, pass FROM taikhoan');
  let migrated = 0, skipped = 0;

  for (const u of users) {
    if (u.pass && u.pass.startsWith('$2')) { skipped++; continue; }
    const hashed = await bcrypt.hash(u.pass || 'changeme123', 10);
    await conn.execute('UPDATE taikhoan SET pass = ? WHERE id = ?', [hashed, u.id]);
    console.log(`  ✅ Migrated: ${u.user}`);
    migrated++;
  }

  console.log(`\n✅ Hoàn thành! ${migrated} migrated, ${skipped} skipped`);
  await conn.end();
}

main().catch(err => { console.error('❌ Lỗi:', err.message); process.exit(1); });
