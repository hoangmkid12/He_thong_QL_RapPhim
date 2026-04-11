require('dotenv').config({ path: __dirname + '/../../.env' });
const { query } = require('../config/db');
const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, dest).then(resolve).catch(reject);
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => { file.close(resolve); });
    file.on('error', (err) => { fs.unlink(dest, () => reject(err)); });
  }).on('error', reject);
});

// Random background color for placeholders (dark nice colors)
const colors = ['1e1e2f', '2a1e2f', '1e2f2e', '2f1e1e', '2f2a1e'];

async function repairImages() {
  console.log('Fetching names from DB to generate unique placeholders...');
  
  // 1. Phim - 600x900
  const phim = await query("SELECT tieu_de, id, img FROM phim WHERE img != '' AND img IS NOT NULL");
  let count = 0;
  
  for (const p of phim) {
    if (!p.img) continue;
    const imgName = p.img.replace('/uploads/phim/', '');
    const dest = path.join(__dirname, '../../uploads/phim', imgName);
    
    // Create folder
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    // Pick color based on ID to be consistent
    const color = colors[p.id % colors.length];
    
    // Build URL string for placeholder
    const text = encodeURIComponent(p.tieu_de.split(' ').slice(0, 4).join('+') + '\\nMovie');
    const url = `https://placehold.co/600x900/${color}/ffffff/png?text=${text}&font=Montserrat`;
    
    console.log(`Downloading: ${p.tieu_de}`);
    await download(url, dest);
    count++;
  }

  console.log('Generating images for Combo...');
  const combo = await query("SELECT ten_combo, id, hinh_anh AS img FROM combo_do_an WHERE hinh_anh != '' AND hinh_anh IS NOT NULL");
  for (const c of combo) {
    if (!c.img) continue;
    const imgName = c.img.replace('/uploads/combo/', '');
    const dest = path.join(__dirname, '../../uploads/combo', imgName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    const color = colors[(c.id + 1) % colors.length];
    const text = encodeURIComponent(c.ten_combo.split(' ').slice(0, 3).join('+') + '\\nCombo');
    const url = `https://placehold.co/400x400/${color}/ffffff/png?text=${text}&font=Montserrat`;
    
    console.log(`Downloading: ${c.ten_combo}`);
    await download(url, dest);
    count++;
  }

  console.log('Repaired ' + count + ' unique images!');
  process.exit(0);
}

repairImages().catch(e => { console.error(e); process.exit(1); });
