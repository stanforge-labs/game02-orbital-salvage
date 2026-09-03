# Внешние ассеты

В таблице указаны только внешние файлы, использованные в текущем core. Ассеты
Kenney имеют лицензию CC0 и допускают коммерческое использование и изменение.
Оригинальные License.txt сохранены в каталогах assets/kenney/.

| Пакет | Автор | Источник | Лицензия | Коммерческое использование | Изменение | Использованные файлы | Где использованы |
|---|---|---|---|---|---|---|---|
| Simple Space | Kenney | https://kenney.nl/assets/simple-space | CC0 1.0 | Да | Да | meteor_detailedSmall.png | Обычный металлолом |
| Space Shooter Remastered | Kenney | https://kenney.nl/assets/space-shooter-remastered | CC0 1.0 | Да | Да | playerShip1_blue.png, meteorBrown_big1.png, meteorGrey_small1.png, Effects/fire01.png | Корабль, плавающие и быстрые обломки, выхлоп |
| UI Pack — Sci-Fi | Kenney | https://kenney.nl/assets/ui-pack-sci-fi | CC0 1.0 | Да | Да | PNG/Blue/Default/bar_round_gloss_large.png | Исходный UI-референс; не используется в текущем русском runtime |
| Exo 2 | The Exo 2 Project / Google Fonts | https://github.com/google/fonts/tree/main/ofl/exo2 | SIL Open Font License 1.1 | Да | Да | Exo2-Variable.ttf, OFL-Exo2.txt | Весь русский интерфейс и HUD |

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
- Exo2-Variable.ttf, OFL-Exo2.txt;
- rare_container.png, space_haze.png, station_glow.png, scrap_glow.png,
  ui_panel.png, ui_button.png — PNG-версии оригинальных SVG-элементов;
- favicon.ico.

Старые неиспользуемые файлы пакетов не входят в игровой runtime и не считаются
отправляемыми ассетами.
