# Режим разработки

Инструменты активны только на `localhost` / `127.0.0.1` или при запуске с `?dev=1`.

| Клавиша | Действие |
| --- | --- |
| F3 | Показать/скрыть DEV HUD: позиция, скорость, сектор, контракт, дистанция до станции, видимый лом и опасности. |
| F4 | Добавить 250 кредитов и 1 технодеталь для короткой QA-проверки. |
| F6 | Выбрать следующий контракт из пула. |
| F7 | Удалить локальное сохранение и перезагрузить игру. |
| F8 | Открыть выбор сектора с разблокированным сектором 2. |
| F9 | Активировать секретный шлюз и перейти к его challenge-коридору. |
| F10 | Пересобрать текущий сектор с новым процедурным seed. |
| F11 | Запустить локальный цикл предупреждения и метеорного потока. |

DEV HUD также показывает seed, текущий регион, FPS/frame time, число активных объектов добычи и опасностей, тип контракта и стадию секретного маршрута. Контуры зон сбора и опасной зоны становятся заметнее. Режим не включается в обычном production-запуске.

Для пересборки source-проекта после правок pass используйте:

```powershell
node scripts/apply-integrated-pass10.js
```

## Full Release Rebuild 14

F9 использует текущий процедурный секретный маршрут. Сначала включите F3,
затем нажмите F9. Команда является DEV-телепортом, не доказательством обычного
прохождения. F10/F11 и остальные существующие клавиши сохранены.
Новые плагины не устанавливались.

Локальный экспорт:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/export-core.ps1 -OutputDirectory exports/full-release14
node scripts/local-static-server.js exports/full-release14 4231
```

Проверки выполняются в отдельных headless Chromium, не трогают активное окно:

```powershell
node scripts/audit-project.js
node scripts/release14-qa.js 1
node scripts/release14-qa.js 2
node scripts/release14-qa.js responsive
node scripts/release14-qa.js seeds
node scripts/release14-fixtures.js
node scripts/release14-modules-qa.js
```

Только `release14-qa.js 1/2` являются обычными маршрутами с чистым сохранением:
управление клавиатурой, чтение координат целей для навигации, без изменения
координат/кредитов/корпуса/прогресса. Fixtures и modules-qa намеренно используют
DEV-состояния. Их кадры нельзя представлять как естественную экономику.
Отчёты находятся в `docs/release14-*.json`.

## Release Candidate Polish 15

Новые расширения не установлены. Существующие F3/F4/F6/F7/F8/F9 сохранены.
Сборка: `node scripts/apply-integrated-pass10.js`; экспорт:
`powershell -ExecutionPolicy Bypass -File scripts/export-core.ps1 -OutputDirectory exports/release15`.
QA ожидает экспорт по `http://127.0.0.1:4232` (локальный static server).

Проверки: `release15-ui-qa.js`, `release15-contracts.js`, `release15-modules-qa.js`,
`release15-seeds.js`, `release15-traverse.js`, `release15-perf.js`, `release15-screens.js`
в папке scripts. Они используют изолированные тестовые состояния и не служат доказательством natural progression.

`release15-natural.js` — чистое сохранение, клавиатура и UI, координатно-информированная навигация без записи состояния игры.
`release15-hud-navigation.js` — короткая проверка только по видимым текстам HUD.
`release15-report.js` собирает успешные исходные трассы из локальной `_tmp-export`; готовые компактные результаты хранятся в docs и не требуют этой временной папки для чтения.
Ограничения и точные результаты перечислены в `docs/RELEASE15_REVIEW.md`.

## Release Production 16

Новые плагины не нужны. F3/F4/F6/F7/F8/F9 сохранены; F9 теперь помещает корабль
у входа актуального секретного маршрута, а не в старую координату внутри стен.
Обычная игра не включает DEV. Не используйте DEV для оценки экономики.

Сборка и экспорт:

```powershell
node scripts/apply-integrated-pass10.js
powershell -ExecutionPolicy Bypass -File scripts/export-core.ps1 -OutputDirectory exports/release16
```

QA ожидает отдельный статический сервер `http://127.0.0.1:4233` для exports/release16.
Не пересобирайте экспорт одновременно с загрузкой новых QA-страниц.

- `release16-natural.js <id>`: чистый browser storage, реальные клавиши/клики,
  координатно-информированный навигатор; никаких записей состояния игры. Для
  сканирования он тормозит встречной тягой в рамках существующего управления.
- `release16-qa.js`: размеры, модальные экраны, mouse/touch, аркада/ambience.
- `release16-contracts.js`: 20 успехов и 20 отрицательных сценариев контрактов.
- `release16-modules-qa.js`: 15 покупок, reset 75%, предложения после reload.
- `release16-effects-qa.js`: эффекты новых модулей и их загрузка, очки/смерть/
  перезапуск аркады, Web Audio. Начальные состояния этих проверок — fixtures.
- `release16-ads-qa.js`: локальные rewarded-заглушки, без production Yandex ads.
- `release16-seeds.js`: 40 seed, 16 семейств/64 подварианта, 8 связных маршрутов.
- `release16-secret-qa.js <from> <to>`: отдельные входные fixtures, далее только
  клавиатура, стандартные 3 HP; проверяет шесть сканирований, кэш и выход.
- `release16-world-qa.js`: постановочные визуальные кадры, НЕ natural proof.
- `release16-perf.js`: пятиминутный runtime sample со сменой тестовых позиций.

В меню: **ЗВУК** (настройка сохраняется), **АМБИЕНТ** (на сеанс), **АРКАДА**.
Аркада: стрелки/A/D, мышь или палец; автоматический огонь, 3 жизни; ESC/НАЗАД.
Ни очки аркады, ни её потери не изменяют основную экономику/сохранение.

## Final Pre-Release 17 — актуальный запуск

Запустите `PLAY_RELEASE17.ps1` в корне проекта: экспорт `exports/release17`,
адрес `http://127.0.0.1:4234/`. Старые порты 4232/4233 показывают старые сборки.
Пересборка: `node scripts/apply-integrated-pass10.js`, затем
`powershell -ExecutionPolicy Bypass -File scripts/export-core.ps1 -OutputDirectory exports/release17`.

Главное меню: новый вылет, выбор сектора, **Орбитальный патруль**, настройки.
ESC / кнопка **ПАУЗА** действительно останавливают полёт и таймер.
**ЖУРНАЛ** / J: условия сектора 2, контракт, секрет, выбор отслеживаемой цели.
Сообщение диспетчера можно пропустить кнопкой; звук/эффекты/ambience сохраняются.

**DEV** внизу справа работает мышью, без функциональных клавиш.
Доступен только localhost/127.0.0.1/[::1] или явный `?dev=1`.
В панели: новый/повторный seed; Sector 1/2; вход в секрет; реальный метеорный
поток; погоня; следующий контракт; +500 кредитов; +1 деталь; улучшения;
подсветка POI/опасностей; сброс локального сохранения с подтверждением.
Сброс затрагивает только `orbitalSalvageSave` на текущем origin.
DEV-выдача ресурсов не является natural playthrough. Старые F-shortcuts сохранены.

QA-скрипты `release17-*` используют 4234 и отдельные браузерные контексты:

- `seeds`: 60 seed, граф, ресурсы, безопасная станция, 8 маршрутов секрета.
- `natural <id>`: клавиатура/клики, чистый storage; чтение координат разрешено навигатору.
- `newcomer`: только видимый текст/компас, без координат мира и DEV.
- `responsive`: восемь viewport/input-конфигураций, пауза, hover, touch.
- `contracts`, `chains`, `events`, `modules-qa`, `effects-qa`, `ads-qa`, `save-qa`: изолированные fixtures.
- `secret-qa 0 4` / `secret-qa 4 8`: входные fixtures, далее реальные клавиши и 3 HP.
- `world-qa`, `proof`: постановочные визуальные состояния, не доказательство natural run.
- `perf`: 300 секунд, 60 samples, frame times/heap/instances; запускать отдельно.

Не пересобирайте экспорт во время загрузки QA-страниц. Для параллельных проверок
предпочтителен `node scripts/local-static-server.js exports/release17 4234`.

## Polish18

Запуск текущего экспорта: `PLAY_POLISH18.ps1`, адрес `http://127.0.0.1:4235/`.
DEV-панель на localhost сохранена, на обычном production-host скрыта.
Кнопки POI / опасностей, быстрый выбор сектора, метеорный поток и погоня
сохранены. Escape — пауза; «Орбитальный патруль» — arcade.

Проверки текущего экспорта, не перезаписывающие отчёты Release17:

- `node scripts/polish18-qa-runner.js responsive`
- `node scripts/polish18-qa-runner.js natural <id>` — чистый storage,
  реальные клавиши/клики; навигатор читает координаты, не имитирует новичка.
- `node scripts/polish18-qa-runner.js proof` — DEV/погоня/визуальные fixtures.
- `node scripts/polish18-qa-runner.js perf` — отдельный 300-секундный stress run.
- `node scripts/polish18-seeds.js` — 60 seed, зазоры декора, неизменность gameplay.
- `node scripts/polish18-hud-qa.js` — длинные заголовки, hover, Escape, размеры loot.
- `node scripts/polish18-side-qa.js` — боковые полёты и одноразовая инициализация.

Декор настраивается в `polish18-world.js`: сетка 345×330, зазор от loot 125,
от другого scenic 230, от gameplay POI 225, от станции 330 мировых единиц.
Scenic18 — отдельный статический пул 110 объектов без коллизий; SecretScene18 — 6.
Нельзя добавлять декоративные точки в `g.pois`: этот список используется миссиями.

## Polish19

Текущая сборка: `PLAY_POLISH19.ps1`, http://127.0.0.1:4236/.
Пересборка: `node scripts/apply-integrated-pass10.js`, затем
`powershell -ExecutionPolicy Bypass -File scripts/export-core.ps1 -OutputDirectory exports/polish19`.

- `polish19-world.js`: региональные веса 12 art families; 8 групп похожих
  силуэтов; зазор 620 world units для объектов размером от 90. Если палитра
  исчерпана на плотном пересечении, вторичный декор уменьшается до 68.
  Позиции gameplay POI, loot, hazards, ключа и ворот не меняются.
- `polish19-runtime.js`: композиционная safe-zone подаётся в прежнее плавное
  слежение. Скорость, инерция, zoom и world bounds корабля не меняются.
  Верхний HUD получает одного владельца текста; старые UI-проходы больше
  не вызывают повторную растеризацию его промежуточных состояний.
- `polish19-ui.js`: фиксированные защищённые полосы текста и боковой feedback.
- `polish19-art.js`: шесть оригинальных аппаратных вариантов без повторения
  антенн у ремонтного причала, реактора и станции. Сторонних ресурсов нет.

Проверки:

```powershell
node scripts/polish19-seeds.js
node scripts/polish19-safe-qa.js
node scripts/polish19-visual.js
node scripts/polish19-qa-runner.js hud
node scripts/polish19-natural.js final
```

Natural использует чистый browser context, клавиши/клики и чтение координат.
DEV-переменные не меняет. Остальные перечисленные visual/safe проверки могут
использовать явно обозначенные стартовые fixtures. Performance trace собирается
в natural; не запускать параллельно другие браузерные тесты. Пороговые counts,
корреляции GC/переходов и ограничения методики — `polish19-performance-analysis.json`.
Профилировщик не включён в production game.json. F3/F4/F6/F7/F8/F9 сохранены.

## World20: Mobile Test Mode

Локальная сборка → DEV → MOBILE TEST MODE. Восемь viewport presets,
поворот, touch simulation, safe/UI/gameplay bounds, hazard outlines и telemetry.
Вложенный тест работает с отдельной in-memory копией save; основной вылет
приостановлен. Закрытие удаляет тест и возобновляет основной полёт.
Подробности и ограничения: `MOBILE_TEST_MODE.md`.

`node scripts/world20-seeds.js` — 100 структурных seed.
`node scripts/world20-visual-qa.js` — 15 visual seed, 5 keyboard traversal seed,
8 mobile presets. Explicit fixtures, не natural progression.
`node scripts/world20-responsive.js` — viewport/hover/touch/safe-zone regression.
`node scripts/world20-natural.js final` — fresh-storage full progression and
continuous performance trace; coordinate-aware read-only navigator, no DEV writes.
Не запускать другие браузерные тесты параллельно natural/performance.

## Mobile UI21

DEV → MOBILE TEST MODE сохраняет восемь пресетов и изоляцию сохранений.
Добавлены Browser UI height 0/56/96 px и Safe insets для проверки короткого
landscape с вырезом/нижней системной зоной. Это симуляция, не реальный телефон.
Reset viewport сбрасывает оба параметра. В production кнопка DEV не добавляется.
Мобильный HUD и модалки используют visualViewport и safe-area; подробности:
`MOBILE_TEST_MODE.md`, результаты: `MOBILE_UI21_REVIEW.md`.
