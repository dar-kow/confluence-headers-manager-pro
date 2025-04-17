<div align="center">
  <img src="./public/icon128.svg" width="256" height="256" />
  
  # Confluence Headers Manager
</div>

**[English](#english) | [Polski](#polski)** 

**[Chrome Web Store](https://chromewebstore.google.com/detail/confluence-headers-manage/egommklldjboiheffbiafffmkekclmpe?authuser=0&hl=pl)**

<a id="english"></a>

## 📋 About the Project

**Confluence Headers Manager** is an intelligent tool that solves one of the most frustrating problems for Confluence users - managing and tracking headers in extensive document spaces. Create dynamic tables of contents with links to sections, automatically collect headers from subpages, and easily navigate complex documentation.

### 🎯 The Problem We're Solving

In extensive Confluence spaces where documentation spans multiple pages, tracking all important sections becomes challenging:

- **Scattered information** - key information is spread across many subpages
- **Lack of visibility** - difficult to see all headers at first glance
- **Time-consuming navigation** - manually searching through multiple pages is a waste of time
- **Inefficient test case management** - tracking statuses and organizing test cases requires additional work

## ✨ Key Features

- **Automatic header collection** from selected Confluence subpages
- **Intelligent status detection** (DONE, TODO, IN_PROGRESS, etc.) while preserving original formatting
- **Table of contents generation** with precise links to specific sections
- **Flexible display formats** - as a bullet list or hierarchical header structure
- **Preservation of original Confluence statuses** - fully compatible with Confluence's native appearance
- **Intuitive user interface** - simple configuration and operation

## 📦 Project Structure

The repository contains two versions of the project on separate branches:

### 🧪 `main` Branch - Development Version (React)

Basic version of the application built using React, primarily intended for developers looking to extend functionality. In this version:

- Clean React code with minimal dependencies
- Easier to understand and modify
- Ideal starting point for developing your own features

### 🚀 `chrome` Branch - Chrome Extension

Advanced version in the form of a Chrome browser extension, ready for use by regular users:

- Full integration with the Confluence interface
- Advanced handling of Confluence statuses and macros
- Performance optimizations for large Confluence spaces
- User-friendly interface without the need for technical knowledge

## 🔧 How It Works

1. **Select the target page** - specify where the table of contents should be created
2. **Select source subpages** - manually or with the help of automatic detection
3. **Customize the format** - bulleted list or header hierarchy
4. **Choose status options** - with or without original Confluence statuses
5. **Done!** - the generated table of contents appears on the selected page

## 🛠️ Installation

### Development Version (branch `main`)

```bash
# Clone the repository
git clone https://github.com/dar-kow/confluence-headers-manager-pro.git

# Navigate to the project directory
cd confluence-headers-manager

# Install dependencies
npm install

# Run the application in development mode
npm start
```

### Chrome Extension (branch `chrome`)

1. Switch to the `chrome` branch:
   ```bash
   git checkout chrome
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build` directory

## 🎨 Creating Custom Icons (Bonus!)

The extension requires icons in sizes 16x16, 48x48, and 128x128 px. If you want to create your own icons based on SVG files, you can use this simple Node.js script:

### Converting SVG to PNG using Node.js

1. **Install the Sharp package**:
   ```bash
   npm install sharp
   ```

2. **Create SVG files** and save them as `icon16.svg`, `icon48.svg`, and `icon128.svg`

3. **Create the `svgToPng.js` script**:
   ```javascript
   // svgToPng.js
   const fs = require('fs');
   const path = require('path');
   const sharp = require('sharp');

   // Function to convert SVG to PNG
   async function convertSvgToPng(svgContent, outputPath, width, height) {
     try {
       // Make sure the target folder exists
       const directory = path.dirname(outputPath);
       if (!fs.existsSync(directory)) {
         fs.mkdirSync(directory, { recursive: true });
       }

       // Convert SVG to PNG with specified dimensions
       await sharp(Buffer.from(svgContent))
         .resize(width, height)
         .png()
         .toFile(outputPath);

       console.log(`Created file: ${outputPath}`);
     } catch (error) {
       console.error(`Conversion error: ${error.message}`);
     }
   }

   // Paths to SVG files
   const svgFiles = {
     icon16: path.join(__dirname, 'icon16.svg'),
     icon48: path.join(__dirname, 'icon48.svg'),
     icon128: path.join(__dirname, 'icon128.svg')
   };

   // Output paths for PNG files
   const outputFiles = {
     icon16: path.join(__dirname, 'public', 'icons', 'icon16.png'),
     icon48: path.join(__dirname, 'public', 'icons', 'icon48.png'),
     icon128: path.join(__dirname, 'public', 'icons', 'icon128.png')
   };

   // Execute conversion
   async function convertAllIcons() {
     try {
       const svg16Content = fs.readFileSync(svgFiles.icon16, 'utf8');
       const svg48Content = fs.readFileSync(svgFiles.icon48, 'utf8');
       const svg128Content = fs.readFileSync(svgFiles.icon128, 'utf8');

       await convertSvgToPng(svg16Content, outputFiles.icon16, 16, 16);
       await convertSvgToPng(svg48Content, outputFiles.icon48, 48, 48);
       await convertSvgToPng(svg128Content, outputFiles.icon128, 128, 128);

       console.log('All icons have been generated!');
     } catch (error) {
       console.error(`Error processing files: ${error.message}`);
     }
   }

   convertAllIcons();
   ```

4. **Run the script**:
   ```bash
   node svgToPng.js
   ```

5. **Use the generated icons** in your extension - they will be placed in the `public/icons/` directory

> 💡 **Tip**: For best results, prepare separate SVG files for each size. 16x16 icons should be very simplified, while 128x128 icons can contain more details.

## 📋 Requirements

- Node.js 14.0+
- React 17.0+
- Access to Confluence with appropriate permissions
- For the extension: Chrome browser 88+

## 📝 Usage Examples

### Tracking Test Cases

Ideal for QA teams to create a master index of all test cases with their current statuses. Helps to easily see:

- Which tests have been completed (DONE)
- Which are in progress (IN_PROGRESS)
- Which have not yet been started (TODO)

### Technical Documentation

An excellent tool for creating a collection of technical documentation from different subpages, with clear hierarchy and completion status for individual sections.

### Knowledge Base

Create a central access point to dispersed knowledge, making it easier for new team members to quickly understand large amounts of information.

## 👥 Contribution and Development

We encourage you to contribute to the project! If you have ideas for improvements or have found a bug:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is available under the MIT license. See the `LICENSE` file for more details.

## 📧 Contact

Have questions or issues? Contact us through the Issues tab in the GitHub repository.

---

⭐ **Give us a star on GitHub if the project was helpful!** ⭐

---

*Confluence is a trademark of Atlassian. This project is not officially affiliated with Atlassian.*

<a id="polski"></a>

# Polska Wersja

**[Chrome Web Store](https://chromewebstore.google.com/detail/confluence-headers-manage/egommklldjboiheffbiafffmkekclmpe?authuser=0&hl=pl)**

## 📋 O Projekcie

**Confluence Headers Manager** to inteligentne narzędzie rozwiązujące jeden z najbardziej uciążliwych problemów użytkowników Confluence - zarządzanie i śledzenie nagłówków w rozbudowanych przestrzeniach dokumentów. Twórz dynamiczne spisy treści z linkami do sekcji, automatycznie zbieraj nagłówki z podstron i łatwo nawiguj po złożonej dokumentacji.

### 🎯 Problem, który rozwiązujemy

W obszernych przestrzeniach Confluence, gdzie dokumentacja rozciąga się na wiele stron, śledzenie wszystkich ważnych sekcji staje się wyzwaniem:

- **Rozproszenie informacji** - kluczowe informacje rozproszone są po wielu podstronach
- **Brak widoczności** - trudno zobaczyć wszystkie nagłówki na pierwszy rzut oka
- **Czasochłonna nawigacja** - ręczne przeszukiwanie wielu stron to strata czasu
- **Niewydajne zarządzanie przypadkami testowymi** - śledzenie statusów i organizacja przypadków testowych wymaga dodatkowej pracy

## ✨ Główne funkcje

- **Automatyczne zbieranie nagłówków** z wybranych podstron Confluence
- **Inteligentne wykrywanie statusów** (DONE, TODO, IN_PROGRESS, itp.) z zachowaniem oryginalnego formatowania
- **Generowanie spisu treści** z dokładnymi linkami do konkretnych sekcji
- **Elastyczne formaty wyświetlania** - jako lista punktowana lub hierarchiczna struktura nagłówków
- **Zachowanie oryginalnych statusów Confluence** - w pełni kompatybilne z natywnym wyglądem Confluence
- **Intuicyjny interfejs użytkownika** - prosta konfiguracja i obsługa

## 📦 Struktura Projektu

Repozytorium zawiera dwie wersje projektu na osobnych branchach:

### 🧪 Branch `main` - Wersja deweloperska (React)

Podstawowa wersja aplikacji zbudowana przy użyciu React, przeznaczona głównie dla deweloperów chcących rozszerzyć funkcjonalność. W tej wersji:

- Czysty kod React z minimalnymi zależnościami
- Łatwiejszy do zrozumienia i modyfikacji
- Idealny punkt wyjścia do rozwoju własnych funkcjonalności

### 🚀 Branch `chrome` - Rozszerzenie Chrome

Rozwinięta wersja w formie rozszerzenia do przeglądarki Chrome, gotowa do użycia dla zwykłych użytkowników:

- Pełna integracja z interfejsem Confluence
- Zaawansowana obsługa statusów i makr Confluence
- Optymalizacje wydajności dla dużych przestrzeni Confluence
- Przyjazny interfejs użytkownika bez konieczności posiadania wiedzy technicznej

## 🔧 Jak to działa

1. **Wybierz stronę docelową** - wskaż, gdzie ma zostać utworzony spis treści
2. **Wybierz źródłowe podstrony** - ręcznie lub z pomocą automatycznego wykrywania
3. **Dostosuj format** - lista punktowana lub hierarchia nagłówków
4. **Wybierz opcje statusów** - z lub bez oryginalnych statusów Confluence
5. **Gotowe!** - wygenerowany spis treści pojawia się na wybranej stronie

## 🛠️ Instalacja

### Wersja deweloperska (branch `main`)

```bash
# Klonuj repozytorium
git clone https://github.com/dar-kow/confluence-headers-manager-pro.git

# Przejdź do katalogu projektu
cd confluence-headers-manager

# Zainstaluj zależności
npm install

# Uruchom aplikację w trybie deweloperskim
npm start
```

### Rozszerzenie Chrome (branch `chrome`)

1. Przełącz się na branch `chrome`:
   ```bash
   git checkout chrome
   ```

2. Zbuduj rozszerzenie:
   ```bash
   npm run build
   ```

3. Załaduj rozszerzenie w Chrome:
   - Otwórz Chrome i przejdź do `chrome://extensions/`
   - Włącz "Tryb programisty"
   - Kliknij "Załaduj rozpakowane" i wybierz katalog `build`

## 🎨 Tworzenie własnych ikon (Bonus!)

Rozszerzenie wymaga ikon w rozmiarach 16x16, 48x48 i 128x128 px. Jeśli chcesz stworzyć własne ikony bazując na plikach SVG, możesz użyć tego prostego skryptu Node.js:

### Konwersja SVG na PNG za pomocą Node.js

1. **Zainstaluj pakiet Sharp**:
   ```bash
   npm install sharp
   ```

2. **Utwórz pliki SVG** i zapisz je jako `icon16.svg`, `icon48.svg` i `icon128.svg`

3. **Utwórz skrypt `svgToPng.js`**:
   ```javascript
   // svgToPng.js
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

   // Ścieżki do plików SVG
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
   ```

4. **Uruchom skrypt**:
   ```bash
   node svgToPng.js
   ```

5. **Użyj wygenerowanych ikon** w swoim rozszerzeniu – zostaną umieszczone w katalogu `public/icons/`

> 💡 **Wskazówka**: Dla najlepszych wyników, przygotuj oddzielne pliki SVG dla każdego rozmiaru. Ikony 16x16 powinny być bardzo uproszczone, podczas gdy ikony 128x128 mogą zawierać więcej szczegółów.

## 📋 Wymagania

- Node.js 14.0+
- React 17.0+
- Dostęp do Confluence z odpowiednimi uprawnieniami
- Dla rozszerzenia: przeglądarka Chrome 88+

## 📝 Przykłady użycia

### Śledzenie przypadków testowych

Idealny dla zespołów QA do tworzenia głównego indeksu wszystkich przypadków testowych z ich aktualnymi statusami. Pomaga łatwo zobaczyć:

- Które testy zostały ukończone (DONE)
- Które są w trakcie (IN_PROGRESS)
- Które jeszcze nie zostały rozpoczęte (TODO)

### Dokumentacja techniczna

Doskonałe narzędzie do tworzenia zbioru dokumentacji technicznej z różnych podstron, z jasną hierarchią i stanem ukończenia poszczególnych sekcji.

### Baza wiedzy

Stwórz centralny punkt dostępu do rozproszonej wiedzy, ułatwiając nowym członkom zespołu szybkie zrozumienie wielkiej ilości informacji.

## 👥 Wkład i rozwój

Zachęcamy do współtworzenia projektu! Jeśli masz pomysły na ulepszenia lub znalazłeś błąd:

1. Rozwidlij repozytorium
2. Stwórz branch na swoją funkcjonalność (`git checkout -b feature/amazing-feature`)
3. Zatwierdź zmiany (`git commit -m 'Add amazing feature'`)
4. Wypchnij do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest udostępniany na licencji MIT. Zobacz plik `LICENSE` po więcej szczegółów.

## 📧 Kontakt

Powstały pytania lub problemy? Skontaktuj się z nami poprzez zakładkę Issues w repozytorium GitHub.

---

⭐ **Daj nam gwiazdkę na GitHubie, jeśli projekt okazał się pomocny!** ⭐

---

*Confluence jest znakiem towarowym Atlassian. Ten projekt nie jest oficjalnie powiązany z Atlassian.*