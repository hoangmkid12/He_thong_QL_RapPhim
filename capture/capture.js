const puppeteer = require('puppeteer');

(async () => {
  console.log('Khởi chạy trình duyệt...');
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Đăng nhập tài khoản admin_hethong...');
  await page.goto('http://localhost:5173/dang-nhap', { waitUntil: 'networkidle2' });
  
  // Tìm input username và password theo placeholder do react viết class custom
  await page.type('input[placeholder="Nhập tên đăng nhập"]', 'admin_hethong');
  await page.type('input[placeholder="Nhập mật khẩu"]', '123456');
  await page.click('button[type="submit"]');

  // Đợi chuyển hướng sau đăng nhập
  console.log('Đợi tải trang Admin Dashboard...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000)); // Đợi biểu đồ hoặc data load
  await page.screenshot({ path: '../assets/admin_dashboard.png' });

  console.log('Chuyển tới phần chức năng Quản lý phim...');
  await page.goto('http://localhost:5173/admin/phim', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '../assets/admin_movies.png' });

  console.log('Chụp ảnh thành công!');
  await browser.close();
})();
