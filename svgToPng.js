// svgToPng.js - wymaga zainstalowania Sharp: npm install sharp
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Funkcja konwertująca SVG do PNG
async function convertSvgToPng(svgContent, outputPath, width, height) {
  try {
    // Upewnij się, że folder docelowy istnieje
    const directory = path.dirname(outputPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Konwersja SVG na PNG o podanych wymiarach
    await sharp(Buffer.from(svgContent))
      .resize(width, height)
      .png()
      .toFile(outputPath);

    console.log(`Utworzono plik: ${outputPath}`);
  } catch (error) {
    console.error(`Błąd konwersji: ${error.message}`);
  }
}

// Ścieżki do plików SVG (skopiuj zawartość SVG do tych plików)
const svgFiles = {
  icon16: path.join(__dirname, 'icon16.svg'),
  icon48: path.join(__dirname, 'icon48.svg'),
  icon128: path.join(__dirname, 'icon128.svg')
};

// Ścieżki wyjściowe do plików PNG
const outputFiles = {
  icon16: path.join(__dirname, 'public', 'icons', 'icon16.png'),
  icon48: path.join(__dirname, 'public', 'icons', 'icon48.png'),
  icon128: path.join(__dirname, 'public', 'icons', 'icon128.png')
};

// Wykonaj konwersję
async function convertAllIcons() {
  try {
    const svg16Content = fs.readFileSync(svgFiles.icon16, 'utf8');
    const svg48Content = fs.readFileSync(svgFiles.icon48, 'utf8');
    const svg128Content = fs.readFileSync(svgFiles.icon128, 'utf8');

    await convertSvgToPng(svg16Content, outputFiles.icon16, 16, 16);
    await convertSvgToPng(svg48Content, outputFiles.icon48, 48, 48);
    await convertSvgToPng(svg128Content, outputFiles.icon128, 128, 128);

    console.log('Wszystkie ikony zostały wygenerowane!');
  } catch (error) {
    console.error(`Błąd podczas przetwarzania plików: ${error.message}`);
  }
}

convertAllIcons();