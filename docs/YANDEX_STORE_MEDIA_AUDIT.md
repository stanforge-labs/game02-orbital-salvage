# Yandex Store Media Audit

Дата: 2026-09-15. Только store media и Console metadata; production-код не изменялся.

## Официальные требования

Повторно открыты [требования к игре и промоматериалам](https://yandex.ru/dev/games/doc/ru/concepts/requirements) (редакция 18.08.2026) и [заполнение Draft: поля и медиаматериалы](https://yandex.ru/dev/games/doc/ru/console/add-new-game/draft).

- Иконка 512×512 PNG, обложка 800×470 PNG; не screenshots.
- Landscape screenshots: 16:9, длинная сторона 1280–2560, JPEG или 24-bit PNG; минимум два для каждой заявленной платформы. Подготовлены 6 desktop + 4 mobile.
- Обязательное горизонтальное видео: MP4, 16:9, высота ≥400, ≤28 секунд, ≤100 МБ.
- Реальная игра занимает весь игровой viewport снимков; игровые HUD/подсказки занимают меньшую часть, не закрывают корабль. Нет внешних рамок, OS/browser UI, URL или DEV. В видео 26/26 секунд — реальный игровой процесс, без заставок.

## Файлы

Все пути относительно release/store_media/. Preview и contact sheet — только QA, не загружать.

| Filename | Width×height | Format | Bytes | Device | Real gameplay | Browser/system UI | DEV | Title exact | Result |
|---|---|---|---:|---|---|---|---|---|---|
| icon/icon_512.png | 512×512 | PNG 24-bit RGB | 145359 | Both | NO | NO | NO | N/A | PASS |
| cover/cover_800x470.png | 800×470 | PNG 24-bit RGB | 216940 | Both | NO | NO | NO | N/A | PASS |
| screenshots/desktop/01_sector1_salvage.png | 1920×1080 | PNG 24-bit RGB | 756179 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/desktop/02_meteor_chase.png | 1920×1080 | PNG 24-bit RGB | 727432 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/desktop/03_contract_gameplay.png | 1920×1080 | PNG 24-bit RGB | 747184 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/desktop/04_sector2.png | 1920×1080 | PNG 24-bit RGB | 935550 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/desktop/05_secret_lasers.png | 1920×1080 | PNG 24-bit RGB | 683263 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/desktop/06_upgraded_ship.png | 1920×1080 | PNG 24-bit RGB | 874899 | desktop | YES | NO | NO | N/A | PASS |
| screenshots/mobile/01_mobile_salvage.png | 1280×720 | PNG 24-bit RGB | 301143 | mobile | YES | NO | NO | N/A | PASS |
| screenshots/mobile/02_mobile_meteor.png | 1280×720 | PNG 24-bit RGB | 329245 | mobile | YES | NO | NO | N/A | PASS |
| screenshots/mobile/03_mobile_sector2.png | 1280×720 | PNG 24-bit RGB | 369584 | mobile | YES | NO | NO | N/A | PASS |
| screenshots/mobile/04_mobile_secret.png | 1280×720 | PNG 24-bit RGB | 269713 | mobile | YES | NO | NO | N/A | PASS |
| icon/icon_preview_256.png | 256×256 | PNG 24-bit RGB | 73426 | QA only | NO | NO | NO | N/A | PASS |
| icon/icon_preview_128.png | 128×128 | PNG 24-bit RGB | 26897 | QA only | NO | NO | NO | N/A | PASS |
| icon/icon_preview_64.png | 64×64 | PNG 24-bit RGB | 9002 | QA only | NO | NO | NO | N/A | PASS |
| store_media_contact_sheet.png | 1440×1200 | PNG 24-bit RGB | 1041402 | QA only | MIXED | NO | NO | N/A | PASS |

Название на icon/cover отсутствует намеренно; выбранные gameplay-снимки не содержат название игры, поэтому Title exact = N/A. В Console — строго «Космический сборщик».

## Видео

| File | Resolution | Codec | Duration | FPS | Bytes | Audio | Result |
|---|---|---|---:|---|---:|---|---|
| video/gameplay_16x9.mp4 | 1920×1080 | h264 / yuv420p | 26 s | 25/1 | 5588060 | NONE (silent) | PASS |

Монтаж: 0–5 сбор; 5–10 погоня; 10–15 Sector 2/аномалия; 15–21 лазеры; 21–26 возврат. Пять непрерывных фрагментов, скорость не менялась. Звуковая дорожка не добавлялась: запись Playwright без аудио; сторонней музыки нет. Полный FFmpeg decode прошёл; Chromium воспроизвёл MP4 до ended=true, currentTime=26; page errors=0. Проверены кадры каждые 0,5 секунды и границы монтажных склеек. Не выдаётся за тест физического телефона.

## Визуальный отбор и происхождение

Каждый итоговый PNG отдельно открыт в полном размере; иконка также проверена в 256/128/64. Слабые/пустые кадры у станции и кадры с менее удачной композицией исключены. Sector 2 переснят для более содержательной сцены и чистого PNG без видеокомпрессии. Корабль, лут, метеоры и лазеры читаются; снимки не дорисовывались, не масштабировались и не коллажировались.

Desktop 1920×1080. Mobile — настоящий production mobile layout в touch-capable context 640×360 CSS / DPR 2, выход 1280×720. Это browser emulation, не фотография физического устройства.

Свежие прохождения с обычными клавишами и видимыми кнопками заработали контракты, модули, Sector 2 и секрет. Навигатор только читал координаты, без записи HP/ресурсов/прогрессии. Дополнительные desktop-кадры продолжают фактически заработанное сохранение, без изменения его полей. SDK initialization substitute находится только в capture harness; rewarded-награды для съёмки не вызывались. DEV отсутствует и в архиве, и на изображениях.

Icon/cover: project-original station/wreck/meteor/loot SVG, новый звёздный фон; корабль — векторная адаптация существующего Kenney CC0 ship. Не screenshot, не чужой арт, не AI. Источники: source/README.md и [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md).

## Console limits

| Field | Characters | Allowed | Result |
|---|---:|---|---|
| Название | 19 | 1–50 | PASS |
| SEO description | 130 | 50–160 | PASS |
| Короткое описание | 62 | 1–70 | PASS |
| Об игре | 416 | 100–1000 | PASS |
| Как играть | 321 | 100–1000 | PASS |
| Ключевые слова | 87 | 1–100 | PASS |
| Комментарий модератору | 453 | 0–2048 | PASS |

Короткое описание: Собирайте лом, улучшайте корабль и исследуйте опасные сектора.

Desktop + Mobile; русский; Landscape; Cloud Save OFF; Monetization ON — Rewarded Ads. Тексты, кроме запрошенного короткого описания и уточнения платформ/медиапакета, сохранены.

## Production integrity

ZIP: release/OrbitalSalvage_Yandex_1.0.0_closeout_final.zip

SHA256: 110E4C820112195FC7AACEFDC65A3E8CE49AA33646C64D36C99CA3040C3EE23E

Совпадение с исходным ожидаемым hash: PASS. Пересборки не было. Старые ZIP и пользовательские файлы сохранены. Raw recordings, test storage, node_modules и QA thumbnails не включены в production или Git.

## Evidence

source/capture-evidence.json — реальные timelines; source/selection.json — происхождение снимков; source/video-edit.json — интервалы исходного видео; source/video-probe.json и source/video-playback.json — техническая проверка; source/visual-review.json — SHA просмотренных файлов; source/media-validation.json — машиночитаемые размеры/лимиты/хэши. Contact sheet только внутренний QA.

## Final local acceptance

- [x] Production ZIP + expected SHA256
- [x] Icon 512×512 PNG
- [x] Cover 800×470 PNG
- [x] 6 desktop screenshots
- [x] 4 mobile screenshots
- [x] Horizontal gameplay MP4
- [x] Console texts within limits
- [x] Store media audit
- [x] No OS/browser UI or DEV
- [x] Title consistent

VERDICT: READY FOR YANDEX DRAFT

Это готовность локального пакета к загрузке Draft, не утверждение о пройденной модерации. Загрузка, фактическая приёмка файлов Console и платформенные Draft-проверки остаются следующими действиями.
