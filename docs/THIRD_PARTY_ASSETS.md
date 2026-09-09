# Внешние ассеты

В таблице указаны только внешние файлы, использованные в текущем core. Ассеты
Kenney имеют лицензию CC0 и допускают коммерческое использование и изменение.
Оригинальные License.txt сохранены в каталогах assets/kenney/.

| Пакет | Автор | Источник | Лицензия | Коммерческое использование | Изменение | Использованные файлы | Где использованы |
|---|---|---|---|---|---|---|---|
| Simple Space | Kenney | https://kenney.nl/assets/simple-space | CC0 1.0 | Да | Да | meteor_detailedSmall.png | Обычный металлолом |
| Space Shooter Remastered | Kenney | https://kenney.nl/assets/space-shooter-remastered | CC0 1.0 | Да | Да | playerShip1_blue.png, meteorBrown_big1.png, meteorGrey_small1.png, Effects/fire01.png | Корабль, плавающие и быстрые обломки, выхлоп |
| UI Pack — Sci-Fi | Kenney | https://kenney.nl/assets/ui-pack-sci-fi | CC0 1.0 | Да | Да | PNG/Blue/Default/bar_round_gloss_large.png | Исходный UI-референс; не используется в текущем русском runtime |
| Russo One | Jovanny Lemonad / Google Fonts | https://github.com/google/fonts/tree/main/ofl/russoone | SIL Open Font License 1.1 | Да | Да | RussoOne-Regular.ttf, OFL-RussoOne.txt | Весь русский интерфейс и HUD |

SVG-панели `ui_full_screen.svg`, `ui_full_card.svg`, `ui_full_hud.svg`,
`ui_full_button.svg` и `ui_damage_flash.svg` — оригинальные элементы проекта,
не сторонние ассеты. Они добавлены как масштабируемая оболочка интерфейса и
эффект попадания.

## Копии в проекте

Фактически используемые копии нормализованы в assets/game/:

- background_space.png — оригинальный фон проекта;
- station_custom.png — оригинальная станция проекта;
- ship_player.png;
- salvage_scrap.png;
- hazard_debris.png;
- hazard_fast.png;
- vfx_fire01.png;
- ui_bar_blue.png — сохранён как исходный UI-ресурс, не используется в текущем русском runtime;
- RussoOne-Regular.ttf, OFL-RussoOne.txt;
- rare_container.png, space_haze.png, station_glow.png, scrap_glow.png,
  ui_panel.png, ui_button.png, ui_full_screen.svg, ui_full_card.svg,
  ui_full_hud.svg, ui_full_button.svg, ui_damage_flash.svg — оригинальные
  элементы проекта;
- favicon.ico.

Старые неиспользуемые файлы пакетов не входят в игровой runtime и не считаются
отправляемыми ассетами.

## Оригинальная графика GameplayDepth07 / SmartPolish08

`salvage_engine.svg`, `salvage_beam.svg`, `asteroid_small.svg`,
`asteroid_medium.svg`, `asteroid_large.svg`, `asteroid_crystal.svg`,
`sector2_haze.svg`, `sector2_wreck.svg`, `sector2_wreck2.svg` — оригинальная
векторная графика проекта. В SmartPolish08 силуэты wreck заменены на детали
разрушенных кораблей: секции корпуса, панели, балки, антенны и двигатели.
Новых внешних пакетов и платных ассетов не добавлялось.

## Оригинальная графика Gameplay Overhaul 13

`salvage_energy.svg`, `salvage_data.svg`, `salvage_heavy.svg`,
`poi_relay.svg`, `ship_modules.svg` — оригинальные векторные элементы проекта.
Они созданы для новых категорий добычи, процедурных ориентиров и визуального
отображения установленных модулей корабля. Сторонние ассеты и расширения в этом
pass не добавлялись.

## Оригинальная графика Full Release Rebuild 14

## Оригинальная графика Release Candidate Polish 15

Автор/источник: оригинальная векторная графика проекта, генератор `scripts/release15-art.js`.
Файлы: `salvage15-0.svg` … `salvage15-5.svg`, `gate15.svg`, `relay15.svg`,
`module15-0.svg` … `module15-10.svg` — всего 19 SVG.
Внешние изображения, пакеты и лицензируемые сторонние элементы не использованы.
Сторонняя лицензия для этих оригинальных файлов не требуется; лицензии прежних ресурсов сохранены.

### Источник файлов pass 14

Автор: оригинальная графика проекта, созданная в рамках этого задания.
Источник: `scripts/release14-art.js`, `scripts/release14-layout.js`.
Сторонние изображения и пакеты не использовались; внешняя лицензия не требуется.
Файлы: `meteor14-0.svg` … `meteor14-5.svg` (шесть стабильных вариантов),
`bulkhead14.svg` (секция переборки), `pocket14.svg` (безопасная зона),
`dim14.svg` (затемнение), `module14.svg` (установленный модуль).
Существующие лицензии остальных ресурсов не изменены.

## Release Production 16 — оригинальные ассеты

24 SVG созданы внутри проекта генератором `scripts/release16-art.js`:
`hud16.svg`, `key16.svg`, `energy16.svg`, `radiation16.svg`,
`wreck16-0.svg` … `wreck16-7.svg`, `meteor16-0.svg` … `meteor16-7.svg`,
`module16-0.svg` … `module16-3.svg`.
Автор/источник: оригинальная графика этого проекта, не сторонний пакет.
Внешние изображения и новые сторонние лицензии отсутствуют.
Аркада переиспользует существующий `ship_player.png` и оригинальный `meteor16-3.svg`.
Звуки и гармонический ambience синтезируются Web Audio в `release16-systems.js`;
аудиосэмплы и сторонняя музыка не импортировались.

## Final Pre-Release 17

Новые `composition17-0.svg` … `composition17-15.svg` и `atmosphere17.svg` —
оригинальные SVG проекта, создаются `scripts/release17-art.js`.
Спутники, антенны, разбитые корпуса, секции станции и грузовые рамы собраны
в самостоятельные композиции; сторонние изображения не использованы.

Переиспользован локальный `Exo2-Variable.ttf` (Exo 2, Natanael Gama, SIL OFL 1.1).
Полный текст лицензии: `assets/game/OFL-Exo2.txt`. CDN не нужен.
Новых внешних assets, plugins/extensions и платных пакетов в этом pass нет.
