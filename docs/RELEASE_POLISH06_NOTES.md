# Release Polish 06

Текущий локальный pass для русской версии «Космического сборщика».

## Состав

- закрытые масштабируемые панели и кнопки на SVG;
- шесть самостоятельных улучшений в сетке 2×3;
- контракты: лом, контейнер и вылет без повреждений;
- технодетали, обновление предложений и сброс улучшений;
- сектор 1 «Безопасная орбита» и открываемый сектор 2 «Пояс обломков»;
- локальная заглушка rewarded ads: x2 награда, второй шанс и обновление предложений;
- onboarding первого вылета, урон, вспышка, shake и pickup feedback.

## Проверка

Экспорт выполняется из `game.json`:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\export-core.ps1 -OutputDirectory exports\release-polish06
python -m http.server 4220 --bind 127.0.0.1 --directory .\exports\release-polish06
node .\scripts\release-polish06-qa.js
```

Свежие кадры лежат в `screenshots/ReleasePolish06/`. Динамическая трасса
камеры: `docs/camera-trace-release-polish06.csv`.

Официальный `/sdk.js` добавляется только на домене Яндекс Игр; в локальный
экспорт физический SDK не копируется.
