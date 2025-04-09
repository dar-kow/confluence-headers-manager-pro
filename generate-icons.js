const fs = require('fs');
const { createCanvas } = require('canvas');

// Funkcja do generowania ikony
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Tło
  ctx.fillStyle = '#0052CC'; // Niebieski kolor Confluence
  ctx.fillRect(0, 0, size, size);
  
  // Litery
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Dostosuj rozmiar czcionki do wielkości ikony
  const fontSize = Math.floor(size * 0.5);
  ctx.font = `bold ${fontSize}px Arial`;
  
  // Narysuj tekst "CHM" (Confluence Headers Manager)
  ctx.fillText('CHM', size / 2, size / 2);
  
  // Zapisz jako PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icons/icon${size}.png`, buffer);
  
  console.log(`Wygenerowano ikonę ${size}x${size} px`);
}

// Upewnij się, że katalog istnieje
if (!fs.existsSync('public/icons')) {
  fs.mkdirSync('public/icons', { recursive: true });
}

// Wygeneruj ikony w różnych rozmiarach
generateIcon(16);
generateIcon(48);
generateIcon(128);