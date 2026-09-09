const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const get=n=>JSON.parse(fs.readFileSync('docs/release17-'+n+'.json'));
const seeds=get('seeds'),runs=[get('natural-accept1'),get('natural-accept2')],newcomer=get('newcomer'),perf=get('performance'),responsive=get('responsive'),routes=[...get('secret-routes-0').routes,...get('secret-routes-4').routes];
const evidence=['ads','chains','contracts','effects','events','modules','natural-accept1','natural-accept2','newcomer','proof','responsive','save','secret-routes-0','secret-routes-4','seeds','world-visuals','performance'];
for(const n of evidence){const r=get(n);assert.equal(r.failure,undefined,n);assert.equal(r.errors?.length||0,0,n);assert.equal(r.failures?.length||0,0,n);}assert.ok(perf.seconds>=300);assert.equal(seeds.seeds.length,60);assert.ok(responsive.views.every(v=>!v.failure));
for(const r of runs){const end=r.events.find(e=>e.name==='secret-end'),back=r.events.find(e=>e.name==='sector2-return'),reload=r.events.find(e=>e.name==='reload-continue');assert.ok(end.state.secret.cache&&end.state.secret.stage===6);assert.equal(back.state.credits,reload.state.credits);assert.ok(!r.events.some(e=>e.failure));}
const shots=fs.readdirSync('screenshots/FinalPreRelease17').filter(n=>/^\d\d-/.test(n)).sort();assert.equal(shots.length,35);
const event=(r,n)=>r.events.find(e=>e.name===n),fmt=n=>Number(n).toFixed(1),timeline=r=>r.events.filter(e=>e.name!=='loot').map(e=>`| ${fmt(e.seconds)} | ${e.name} | ${e.state.missionType} | ${e.state.credits} |`).join('\n');
const summary={build:'FINAL PRE-RELEASE 17',generated:new Date().toISOString(),verdict:'NOT READY',reason:'Requested seven distinct meteor behaviours are not all implemented/verified; the rare multi-direction sequence is not added.',stableRegression:true,static:{jsonValid:true,objects:143,instances:753,resources:122,missingResources:0,unknownInstances:0,invalidColors:0},autoSeeds:seeds.seeds.map(s=>s.seed),visualSeeds:fs.readdirSync('screenshots/FinalPreRelease17').filter(n=>/^seed-/.test(n)).map(n=>Number(n.match(/\d+/)[0])),natural:runs.map(r=>({seconds:r.seconds,firstLoot:event(r,'loot').seconds,firstReturn:event(r,'return').seconds,firstUpgrade:event(r,'purchase').seconds,sector2:event(r,'sector2').seconds,gate:event(r,'gate').seconds,cache:event(r,'secret-end').seconds,return:event(r,'sector2-return').seconds,seeds:[...new Set(r.events.map(e=>e.state?.seed).filter(Boolean))]})),newcomerSeconds:newcomer.seconds,performance:perf,checks:evidence,screenshots:shots.map(n=>({file:n,sha256:crypto.createHash('sha256').update(fs.readFileSync('screenshots/FinalPreRelease17/'+n)).digest('hex')}))};
fs.writeFileSync('docs/release17-summary.json',JSON.stringify(summary,null,2));
const text=`# FINAL PRE-RELEASE 17

Дата: 2026-09-10. База: cb1433b2a35aa79161d2443c2941ad952f08feaf.
Сборка: exports/release17. Запуск: PLAY_RELEASE17.ps1, http://127.0.0.1:4234/.
Это подробный отчёт фактической реализации, а не заявление о production deployment.

## INITIAL AUDIT

Исходный мир был вытянут в один маршрут; уход в сторону оставлял мало ориентиров.
Меню скрывало аркаду и выбор сектора, полноценной паузы не было. HUD и подсказки
имели конкурирующие подписи. Во время реальных тестов дополнительно выявлены:
неверная навигация после выполнения speed-условия; недостающий второй ценный
предмет для highrisk на некоторых seed; потеря контрактного усиления после reload.
Эти ошибки исправлены и соответствующие проверки повторены.

## WORLD GENERATION — DONE

Региональная схема переведена в двумерную сеть с боковыми ветвями и петлями.
Сохраняются 16 существующих layout families / 64 подварианта; это НЕ 16 новых
семейств. Добавлены перестановки дальних узлов, jitter, связи и пространственное
покрытие композициями. Первые учебные области намеренно узнаваемы.
Граф всех 60 seed связан. Самый большой проверенный зазор до POI/станции:
${Math.max(...seeds.seeds.map(s=>s.maxEmptyDistance))} м на сетке 100 м.
Это метрика покрытия, не доказательство интересного события каждые 5 секунд.
Обычные длинные стены не возвращены; секретные переборки сохранены.

## REGIONS / DECORATION — DONE

Рабочая орбита: навигационные спутники и безопасный подход. Поле обломков:
разломанные корпуса и грузовые карманы. Кладбище: солнечные панели/антенны.
Метеорный регион: движущиеся траектории и свободные промежутки. Дальние зоны:
контейнерные следы, ретрансляторы, радиация, аномальный сигнал.
16 новых SVG-композиций: восемь базовых силуэтов с вариантами деталей/ориентации.
Одна ведущая композиция региона плюс отдельные малые ориентиры между регионами.
Старый случайный декоративный scatter выключен, а не наложен ещё одним слоем.
Главный POI 138–172 world px; вторичный 112–136. POI-пул 76, event-пул 4,
ambient-пул 3. Тёмная декорация отделена от светлого лута и опасностей.

## LOOT — DONE

Количество и стоимость обычных ресурсов сохранены. Лут перераспределён вокруг
областей с разнесением, без плотных куч. Ключ, data, energy и heavy сохранены.
Highrisk гарантированно получает два существующих ценных предмета в опасной
области: перенос без добавления награды. Проверено на 60 seed и двух новых runs.
Размер корабля, camera zoom, ускорение и управление не изменялись.

## HAZARDS — PARTIAL

Сохранены стабильные метеоры, тяжёлые/узкие hazards, moving debris, radiation,
laser timing и chase. Скорости полос потока разделены; добавлено плавное смещение
траекторий. Chase: предупреждение 2.5 с, преследование до 12 с, безопасное
удаление при выходе из региона, однократность региона.
Не реализована отдельная редкая последовательность нескольких направлений;
весь список из семи самостоятельных meteor behaviours НЕ объявляется DONE.
Коллизии и сложность проверены прохождениями, а не только screenshot fixtures.

## MISSIONS — DONE

23 типа: прежние 20 плюс 3 полноценные цепочки.
ВОССТАНОВИТЬ МАЯК: 3 детали → ремонт с удержанием → пережить волну → отчёт.
СЛЕД ПРОПАВШЕГО СУДНА: два сканирования → data module → эвакуация.
СПАСАТЕЛЬНЫЙ ПРОТОКОЛ: аварийный передатчик → энергоядро → погоня → возврат.
Награды цепочек 130 / 175+деталь / 180+деталь. Все 23 positive/empty-negative
fixtures прошли; три цепочки отдельно завершены. Это не natural-прохождение
каждого позднего контракта. Старые награды не перебалансированы.

## STORY / MICRO EVENTS — DONE

Диспетчер объясняет сбор, подготовку корабля, потерянную экспедицию, ключ,
шлюз и эвакуацию архива. Сообщения короткие, есть кнопка пропуска.
Три локальных события: восстановить маяк (3 с), угасающий distress-сигнал
(45 с на прибытие, 2 с удержания), дрейфующий грузовой узел (2 с).
Занимают место в трюме, дают 20/35 стоимости по сектору, однократно.
Все шесть sector/event сочетаний проверены; повторной выплаты нет.

## SECTOR 2 — DONE

Выбор сектора доступен в меню и паузе, включая закрытое состояние.
Журнал показывает условия: 6 контрактов, 2 модуля, оборот 1800.
После открытия есть уведомление; новый сектор предлагает отдельный сигнал.
В natural runs открыт через ${fmt(event(runs[0],'unlock').seconds)} / ${fmt(event(runs[1],'unlock').seconds)} с.
Сохраняются повышенные риск/награда и безопасный подход к станции.

## SECRET — DONE функционально; визуальный стиль остаётся сдержанным

Журнал/компас: неизвестный сигнал → запертый шлюз → ключ → возвращение к шлюзу
→ шесть контрольных точек → tech cache → станция. Навигатор ведёт по поворотам,
а не прямо сквозь стену. Старый дублирующий world-label скрыт.
Восемь существующих разных маршрутов сохранены, не выданы за новые.
Изолированные входные fixtures: ${routes.map(r=>r.template+': '+fmt(r.seconds)+' с').join('; ')}.
Во всех шесть сканирований, 3 исходных HP, кэш +180/+1, выход без бессмертия.
Два основных runs проходят всю цепочку без DEV; время gate→cache включает
активацию/переход: ${fmt(event(runs[0],'secret-end').seconds-event(runs[0],'gate').seconds)} / ${fmt(event(runs[1],'secret-end').seconds-event(runs[1],'gate').seconds)} с.

## PAUSE / MENU / ARCADE — DONE

Центрированное меню, заметная кнопка «Орбитальный патруль», выбор сектора,
настройки. ESC и экранная пауза останавливают игру/таймер. Продолжение,
перезапуск, выход и смена сектора; недоставленный груз требует подтверждения.
Аркада переиспользована: мышь/клавиши, автоогонь, 3 жизни, очки, restart.
Тест: 110 очков, 3→0 жизней, повторный старт 3, пул 42. Экономика отдельно.

## DEV PANEL — DONE

Кнопка DEV мышью внизу справа: seed, S1/S2, секрет, поток, chase, контракт,
ресурсы, reset, POI/hazard overlays. Исправлена синхронизация DEV-позиции корабля.
На обычном нелокальном origin DEV скрыт; localhost и явный ?dev=1 разрешены.
Тест production-origin — локально перехваченные ресурсы, не публикация на Yandex.
Инструкция: DEV_TOOLS.md. Существующие F-инструменты не удалены.

## FONTS / UI — DONE основная читаемость

Локальный Exo 2/OFL для меню, навигатора и всех TextObject::Text.
Исправлен фильтр типа GDevelop, из-за которого часть объектов оставалась Arial/Russo.
Три непрозрачные верхние панели, отступы и раздельные строки контракта.
Длинные названия уменьшают кегль. Приоритет meteor warning убирает наложение
на название региона. Обычные world-labels под HUD не дублируются.
Result/upgrades/reset/death проверены; пустой возврат имеет нейтральный заголовок.

## AUDIO — DONE функционально

Web Audio: click, start, pickup, hit, contract, gate и ambience зарегистрированы
в runtime; context running, ограниченный voice count. Master/SFX/ambience
сохраняются. Новая сторонняя музыка не добавлена. Это функциональная проверка
синтеза, не акустическое прослушивание на физическом устройстве.

## UPGRADES / SAVE / ADS — DONE в доступной локальной среде

Все 15 модулей куплены через UI в отдельных funded fixtures; эффекты четырёх
спец-модулей проверены. Reset возвращает floor(3050×.75)=2287: 700→2987,
трюм10→8, корпус4→3, уровни→0, детали15→14; предложения переживают reload.
Исправлена потеря ContractLevel-надбавки при сохранении: 169→reload169.
Финальное сохранение выполняется один раз, не каждый кадр Result.
Два natural runs также сохраняют 520/534 кредитов после reload.
Local rewarded: second chance, x2, reroll прошли; автоматическая реклама не добавлена.
Yandex production ads и физический Android не проверялись.

## GENERATION QA

60 разных auto seed, 12 визуальных seed открыты в натуральном размере.
Два свежих natural runs, отдельный newcomer run. В JSON сохранены настоящие seed
каждого вылета, а не последнее значение. JSON valid; 143 object types,
753 instances, 122 resources; missing/unknown/invalid colors = 0.

## NATURAL RUN 1

Без state writes/DEV, чистый storage; keyboard navigation читает координаты мира.
После двух прохождений исправлены только DEV-позиционирование, одноразовая запись
Result, приоритет предупреждения и применение шрифта. Финальные responsive,
save, visual smoke и 300-секундный stress повторены; два natural run после
последней чисто шрифтовой правки заново не запускались.
Полное время ${fmt(runs[0].seconds)} с. Первый loot ${fmt(event(runs[0],'loot').seconds)} с.

| Секунды | Событие | Контракт | Кредиты |
|---:|---|---|---:|
${timeline(runs[0])}

## NATURAL RUN 2

Та же методика, другой fresh context и новые seed. ${fmt(runs[1].seconds)} с.
Первый loot ${fmt(event(runs[1],'loot').seconds)} с.

| Секунды | Событие | Контракт | Кредиты |
|---:|---|---|---:|
${timeline(runs[1])}

Pacing: первый учебный возврат 27–31 с, первая покупка 80–106 с, затем более
дальние контракты и цепочка; сектор 2 через 7–7.6 мин. Это не 15 минут контента.

## NEW PLAYER RUN

Отдельный fresh context, только текст HUD, видимый компас и кнопки.
Никаких координат объектов, DEV, credit/unlock cheats.
Аркада найдена 1.8 с; пауза 2.5 с; первая покупка 100.9 с;
выбор сектора 443.3 с; S2 444.0 с; запертый сигнал 458.3 с.
Полное видео человеческого новичка не имитировалось. Это UI-only автоматизация.
Первоначальная неудачная попытка выявила speed-навигацию; исправление проверено
новым run, старая попытка не засчитана успешной.

## PERFORMANCE

${fmt(perf.seconds)} с, 60 samples, отдельный headless Chromium без параллельных QA.
Frame time median ${fmt(perf.frames.median)} ms / p95 ${fmt(perf.frames.p95)} / p99 ${fmt(perf.frames.p99)}.
Instances ${perf.samples[0].instances}→${perf.samples.at(-1).instances}, min/max
${Math.min(...perf.samples.map(s=>s.instances))}/${Math.max(...perf.samples.map(s=>s.instances))}.
Heap ${(perf.samples[0].heap/1048576).toFixed(1)}→${(perf.samples.at(-1).heap/1048576).toFixed(1)} MiB;
это samples Chromium, не доказательство отсутствия любых утечек.
Runtime errors 0. Смена позиций/секторов здесь — stress fixtures, не natural.
По сравнению с16 пул682→753; рост ограничен при старте, не per-frame allocation.

## RESPONSIVE

1920×1080,1600×900,1536×864,1366×768,1280×720,1917×920 desktop;
1280×720 touch landscape;720×1280 portrait rotate.
Canvas совпадает с viewport; mouse-hover не двигает корабль; touch двигает;
таймер паузы стоит. Меню, result/death, upgrades, reset, sector select проверены.

## SCREENSHOTS

screenshots/FinalPreRelease17/. 35 обязательных кадров и 12 seed-кадров.
Каждый обязательный кадр открыт при визуальном просмотре, не только сохранён.
Постановочные world/secret кадры не подменяют логи natural runs.
Дополнительно сохранены death/reset; 78 промежуточных responsive-кадров
оставлены локально в _tmp-export/release17-responsive-captures, не удалены.

${shots.map(s=>'- '+s).join('\n')}

## ASSETS/LICENSES

17 оригинальных SVG; внешних packs/extensions нет. Exo 2 уже находился в проекте,
лицензия OFL сохранена. THIRD_PARTY_ASSETS.md обновлён.

## REMAINING

- PARTIAL: не весь список семи самостоятельных meteor behaviours; редкая
  многонаправленная последовательность не реализована. Не выдаю вариацию скорости
  существующих полос за семь новых систем.
- Визуальные темы секретных комнат всё ещё преимущественно различаются планом,
  лазерным рисунком и оттенком; отдельный уникальный арт каждой комнаты не создан.
- Аудио проверено технически, не прослушано через физические динамики.
- Внешний production SDK/Android не проверены, только доступная локальная среда.
- Сохранён пользовательский untracked архив FullReleaseRebuild14.zip. Он не
  включается в commit и не удаляется ради формального clean status.

## COMMIT / PUSH

Hash и результат push записываются в финальном ответе и exports/release17/RELEASE17_HANDOFF.txt
после фиксации. Основной отчёт не содержит вымышленного будущего hash.

## VERDICT

NOT READY — стабильная сборка для проверки подготовлена, но полный заявленный
scope17 не закрыт: расширение meteor behaviours и уникальная художественная
тема каждой секретной комнаты выполнены не полностью. Нулевые runtime errors
не равны полному выполнению задания и не объявляются production-ready.
`;
fs.writeFileSync('docs/RELEASE17_REVIEW.md',text);console.log('Report validated',summary.natural.map(r=>r.seconds));
