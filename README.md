<div align="center">
  <img src="./public/icon128.svg" width="256" height="256" />
  
  # Confluence Headers Manager
</div>

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