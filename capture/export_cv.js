const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Đang khởi tạo trình duyệt...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'cv.html');
  console.log('Đang mở file CV HTML...');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const outputPath = path.resolve('C:/Users/nguye/OneDrive/Desktop', 'CV_Nguyen_Hoang_My.pdf');
  console.log('Đang xuất file PDF...');
  await page.pdf({
    path: outputPath,
    width: '210mm',
    height: '297mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log('✅ Xuất PDF thành công tại: ' + outputPath);
  await browser.close();
})();
