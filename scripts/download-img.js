import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const icons = [
  'clear-day',
  'clear-night',
  'partly-cloudy-day',
  'partly-cloudy-night',
  'cloudy',
  'rain',
  'showers-day',
  'showers-night',
  'sleet',
  'snow',
  'snow-showers-day',
  'snow-showers-night',
  'thunder-rain',
  'thunder-showers-day',
  'thunder-showers-night',
  'wind',
  'fog'
];

const targetDir = path.join(__dirname, 'public', 'icons');

// Create public/icons directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Color';

const downloadIcon = (iconName) => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/${iconName}.svg`;
    const filePath = path.join(targetDir, `${iconName}.svg`);
    const fileStream = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fileStream.close();
        fs.unlinkSync(filePath);
        reject(new Error(`Failed to fetch ${iconName}.svg (Status: ${response.statusCode})`));
        return;
      }

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(` Saved: ${iconName}.svg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filePath);
      reject(err);
    });
  });
};

async function downloadAll() {
  console.log('Starting icon download to public/icons...\n');
  for (const icon of icons) {
    try {
      await downloadIcon(icon);
    } catch (err) {
      console.error(` Error downloading ${icon}:`, err.message);
    }
  }
  console.log('\nAll downloads completed!');
}

downloadAll();