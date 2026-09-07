# Mitt bild projekt

Version 0.3.0

En AI-bildeditor med dra/släpp, markering, klipp/kopiera, klistra som lager, lager, ångra/gör om, export och ChatGPT/OpenAI-baserad bildredigering.

Repository: https://github.com/DSouLzz/Bildprojekt

## Funktioner
- Dra och släpp bilder.
- Markera ett område och klipp/kopiera.
- Klistra in som eget lager och flytta/rotera det.
- Ångra/gör om.
- Exportera PNG.
- ChatGPT-panel för bildredigeringskommandon.
- Krypterad lokal lagring av OpenAI API-nyckeln i desktopappen.
- Automatisk kontroll och nedladdning av nya desktopversioner via GitHub Releases.
- "Vad är nytt?" visas vid start.

## Starta webversion
npm install
npm run dev

## Starta desktopversion i utveckling
npm install
npm run build
npm run desktop

## Bygg installer
npm run dist

GitHub Actions bygger Windows, macOS och Linux när en tagg som `v0.3.0` pushas. Releases används av desktopappens updaterare.

OpenAI API-nyckeln skapas i OpenAI-plattformen och läggs in under Inställningar i desktopappen. Lägg aldrig en API-nyckel direkt i källkoden eller GitHub.
