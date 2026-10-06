# Техническое задание: сайт IC Klima Service

Версия 1.0 · Октябрь 2026

## 1. Общие сведения

**Проект:** сайт по продаже, монтажу и обслуживанию кондиционеров и тепловых насосов в Германии.
**Бренд:** IC Klima Service.
**Язык сайта:** немецкий (весь публичный контент). Админка — на немецком и русском, переключение через выпадающее меню с флагами (см. 8.3).
**Образец по структуре и квизу:** [planer.prosatech.de](https://planer.prosatech.de/).

### 1.1. Цели

1. Генерация заявок (лидов) от частных и коммерческих клиентов через квиз-планер и формы.
2. Презентация услуг: кондиционеры, тепловые насосы, сервис и обслуживание.
3. Витрина оборудования (каталог без онлайн-оплаты) с возможностью запросить предложение по конкретной модели.
4. Простая админка для обработки заявок и управления каталогом.

### 1.2. Целевая аудитория

- Владельцы квартир и домов (Eigentümer), арендаторы (Mieter — нужна санкция арендодателя).
- Малый и средний бизнес: офисы, практики, рестораны, магазины.

## 2. Технологический стек

| Слой | Технология |
|---|---|
| Фронтенд | Next.js (App Router, TypeScript), Tailwind CSS v4, шрифт Montserrat, lucide-react |
| Бэкенд | NestJS 11, Node.js 22 LTS |
| БД | PostgreSQL 16, Prisma ORM |
| Валидация | zod (общие схемы в `packages/shared`) |
| Авторизация админки | JWT в httpOnly cookie, пароли argon2 |
| Файлы | Загрузка через API, ресайз sharp, хранение в Docker volume |
| Почта | SMTP (nodemailer) — уведомление о новой заявке |
| Деплой | Docker Compose: postgres, api, web, caddy (TLS + reverse proxy) |
| Пакетный менеджер | pnpm workspaces (монорепозиторий) |

### 2.1. Архитектура

```
Browser ──> Caddy ──/api/*──> NestJS API ──> PostgreSQL
                 └──/*──────> Next.js (сайт + /admin)
Next.js (SSR) ──внутренняя сеть──> NestJS API
NestJS ──> uploads volume, SMTP
```

Сайт и API работают на одном домене (`/api` проксируется), поэтому cookie авторизации работают без CORS.

### 2.2. Структура репозитория

```
apps/web        Next.js: публичный сайт + админка /admin
apps/api        NestJS: REST API, Prisma, загрузки
packages/shared zod-схемы, типы, конфигурация квиза
docs/TZ.md      это ТЗ
docker-compose.yml, docker-compose.dev.yml, Caddyfile, .env.example
```

## 3. Карта сайта

| URL | Страница |
|---|---|
| `/` | Главная (лендинг + квиз-планер) |
| `/leistungen` | Обзор услуг |
| `/leistungen/klimaanlagen` | Кондиционеры |
| `/leistungen/waermepumpen` | Тепловые насосы |
| `/leistungen/service-wartung` | Сервис и обслуживание |
| `/shop` | Каталог оборудования с фильтрами |
| `/shop/[slug]` | Карточка товара |
| `/anfrage?typ=...` | Короткая форма заявки (Wärmepumpe / Service / Kontakt) |
| `/kontakt` | Контакты + форма |
| `/impressum`, `/datenschutz` | Юридические страницы (шаблоны, текст заполняет заказчик) |
| `/admin/*` | Админка |

Общие элементы: шапка (логотип, меню: Leistungen, Shop, Kontakt; телефон; кнопка «Angebot anfragen»), мобильное меню, футер (контакты, ссылки, Impressum, Datenschutz), cookie-баннер.

## 4. Главная страница

Блоки строго в этом порядке. Все CTA-кнопки плавно прокручивают к квизу (`#planer`).

### 4.1. Erster Bildschirm (Hero)

- H1: **Klimaanlagen für Zuhause & Gewerbe**
- Подзаголовок: **Beratung · Verkauf · Montage · Service**
- Текст: Moderne Klimatechnik für angenehmes Raumklima – individuell geplant und fachgerecht montiert.
- Кнопка: **JETZT ANGEBOT ANFRAGEN**
- Фон: изображение/градиент, бейджи доверия (например «Kostenlos & unverbindlich», «Bundesweite Montage»).

### 4.2. Warum wir?

- Заголовок: **Alles aus einer Hand**
- Пункты с галочками:
  - Individuelle Beratung
  - Professionelle Montage
  - Moderne & energieeffiziente Systeme
  - Lösungen für Privat & Gewerbe
  - Wartung & Service
- Кнопка: **Kostenloses Angebot anfordern**

### 4.3. Unsere Marken

- Заголовок: **Qualität, auf die Sie sich verlassen können**
- Текст: Wir arbeiten mit Klimaanlagen führender Hersteller:
- Марки (список берётся из БД, управляется в админке): Daikin · Mitsubishi Electric · Mitsubishi Heavy Industries · LG · Panasonic · Samsung · Bosch · Midea · Haier · Toshiba · Fujitsu · Gree
- Подпись: Weitere Hersteller auf Anfrage.

### 4.4. So einfach geht's

- Заголовок: **In 4 Schritten zu Ihrer Klimaanlage**
- 01 – **Anfrage senden**: Kurze Angaben zu Ihrem Objekt übermitteln.
- 02 – **Beratung & Angebot**: Wir finden die passende Lösung und erstellen Ihr individuelles Angebot.
- 03 – **Termin vereinbaren**: Gemeinsam vereinbaren wir Ihren Montagetermin.
- 04 – **Professionelle Montage**: Ihre Klimaanlage wird fachgerecht installiert und in Betrieb genommen.

### 4.5. Unsere Klimasysteme

- Заголовок: **Unsere Klimasysteme**, подзаголовок: Für jeden Bedarf die passende Klimalösung.
- Карточки:
  - **Single-Split** — Eine Inneneinheit – ideal für einzelne Räume.
  - **Multi-Split** — Mehrere Inneneinheiten – ideal für mehrere Räume.
  - **Kühlen & Heizen** — Angenehme Raumtemperatur im Sommer und Winter.
- Текст: Wir beraten Sie gerne und finden das passende System für Ihr Zuhause oder Gewerbe.
- Кнопка: **ANGEBOT ANFRAGEN**

### 4.6. Квиз-планер (`#planer`)

Над карточкой квиза: «Füllen Sie jetzt das kurze Formular aus, um ein maßgeschneidertes Angebot zu erhalten. *Ihre Anfrage ist kostenfrei und unverbindlich». Спецификация — раздел 6.

### 4.7. Плашка «Ihr Experte für Klimaanlagen»

Градиентная плашка + две кнопки: **ZUM SHOP** (`/shop`), **JETZT PLANEN** (`#planer`).

### 4.8. FAQ и футер

FAQ (аккордеон): стоимость, монтаж, скрытые расходы, сроки, арендаторы.

## 5. Страницы услуг

### 5.1. `/leistungen` — Unsere Leistungen

Три карточки со ссылками: Klimaanlagen, Wärmepumpen, Service & Wartung.

### 5.2. `/leistungen/klimaanlagen`

- H1: **Klimaanlagen** — Moderne Klimatechnik für Zuhause & Gewerbe
- Текст: Wir bieten individuelle Klimalösungen für Wohnungen, Häuser, Büros und Gewerbeobjekte – von der Beratung und Planung bis zur fachgerechten Montage und Inbetriebnahme.
- Unsere Leistungen: Beratung & Planung · Verkauf von Klimaanlagen · Fachgerechte Montage & Inbetriebnahme · Wartung, Reinigung & Service · Single-Split- und Multi-Split-Systeme · Kühlen & Heizen
- **Verschiedene Innengeräte für jeden Bedarf** (карточки):
  - Wandgeräte — Die klassische und platzsparende Lösung für Wohnräume, Büros und kleinere Gewerberäume.
  - Deckenkassetten — Unauffällig in die Decke integriert – besonders geeignet für Büros, Praxen, Restaurants und größere Räume.
  - Decken-/Unterdeckengeräte — Leistungsstarke Lösung für größere Räume und gewerbliche Flächen.
  - Truhengeräte — Werden ähnlich wie ein Heizkörper im unteren Wandbereich installiert und bieten eine flexible Alternative zum klassischen Wandgerät.
  - Kanalgeräte — Nahezu unsichtbare Klimatisierung. Die klimatisierte Luft wird über ein Kanalsystem in einen oder mehrere Räume verteilt.
- **Single-Split oder Multi-Split?**
  - Single-Split verbindet ein Außengerät mit einem Innengerät und eignet sich ideal für einen einzelnen Raum.
  - Multi-Split ermöglicht den Anschluss mehrerer Innengeräte an ein Außengerät – ideal für mehrere Räume.
- Sie wissen noch nicht, welches System Sie benötigen? Wir beraten Sie und finden die passende Lösung für Ihr Objekt.
- Кнопка: **ANGEBOT FÜR KLIMAANLAGE ANFRAGEN** → `/#planer`

### 5.3. `/leistungen/waermepumpen`

- H1: **Wärmepumpen** — Effizient heizen mit moderner Technik
- Текст: Wir bieten moderne Luft-Wasser-Wärmepumpen für Ein- und Mehrfamilienhäuser. Eine Wärmepumpe nutzt die Energie der Außenluft und kann Ihr Zuhause effizient mit Heizung und Warmwasser versorgen.
- Unsere Leistungen: Individuelle Beratung · Planung der passenden Anlage · Lieferung der Wärmepumpe · Fachgerechte Montage · Inbetriebnahme · Wartung & Service
- **Monoblock oder Split?** Je nach Gebäude und technischen Voraussetzungen bieten wir die passende Lösung.
  - Monoblock-Wärmepumpen — Die wesentlichen Komponenten befinden sich in einer kompakten Einheit.
  - Split-Wärmepumpen — Das System besteht aus einer Außen- und einer Inneneinheit.
- Welche Lösung für Ihr Gebäude geeignet ist, klären wir individuell bei der Beratung.
- Кнопка: **ANGEBOT FÜR WÄRMEPUMPE ANFRAGEN** → `/anfrage?typ=waermepumpe`

### 5.4. `/leistungen/service-wartung`

- H1: **Service & Wartung** — Damit Ihre Anlage zuverlässig funktioniert
- Текст: Regelmäßige Wartung sorgt für einen zuverlässigen und effizienten Betrieb Ihrer Klima- und Wärmepumpentechnik. IC Klima Service übernimmt die professionelle Wartung, Reinigung und Überprüfung Ihrer Anlagen – für Privat- und Gewerbekunden.
- Unser Service: Wartung von Klimaanlagen · Reinigung von Innen- und Außengeräten · Reinigung und Kontrolle der Filter · Funktions- und Anlagenkontrolle · Fehlerdiagnose & Störungsservice · Reparatur und Austausch von Komponenten · Wartung von Wärmepumpen
- Ob regelmäßige Wartung oder eine konkrete Störung – wir kümmern uns um Ihre Anlage.
- Кнопка: **SERVICE ANFRAGEN** → `/anfrage?typ=service`

### 5.5. Короткая форма заявки `/anfrage`

Поля: тип запроса (Wärmepumpe / Service / Allgemeine Anfrage; предвыбран из `?typ=`), PLZ/Ort, контактный блок (раздел 6.3). Создаёт лид с типом HEAT_PUMP / SERVICE / CONTACT.

## 6. Квиз-планер

### 6.1. Поведение

- Карточка с заголовком шага, подсказкой (необязательно), вариантами, кнопками «назад» / «вперёд» и прогресс-баром.
- **Один вариант** (single): клик выделяет вариант и через ~250 мс переводит на следующий шаг.
- **Множественный выбор** (multi): варианты переключаются, переход только по стрелке «вперёд»; стрелка неактивна, пока ничего не выбрано.
- **Текстовое поле** (text): необязательные поля — стрелка всегда активна.
- Кнопка «назад» неактивна на первом шаге. Ответы сохраняются при возврате назад.
- Прогресс = индекс текущего шага / количество шагов текущей ветки.
- Ответы хранятся в sessionStorage (не теряются при перезагрузке).
- UTM-метки и gclid из URL сохраняются и отправляются с заявкой.

### 6.2. Шаги

| # | ID | Вопрос | Тип | Варианты |
|---|---|---|---|---|
| 1 | rooms | Wie viele Räume sollen klimatisiert werden? | single | 1 Raum, 2 Räume, 3 Räume, über 3 Räume |
| 2 | area | Wie groß ist die zu klimatisierende Gesamtfläche? | single | max. 30 m², max. 45 m², max. 60 m², über 60 m² |
| 3 | indoorType | Welche Art der Inneneinheit wünschen Sie? (*Mehrfachauswahl möglich) | multi | Wandgerät, Deckengerät, Truhengerät, noch unsicher |
| 4 | montage | Wünschen Sie eine Montage durch IC Klima Service? | single | Ja, Nein |
| 5 | expert | Haben Sie bereits genaue Vorstellungen? (*Wenn Sie ja klicken, benötigen wir noch weitere Details von Ihnen.) | single | Ja (Experte), Nein |
| 6 | ownership | Eigentumsverhältnisse (*Mieter benötigen die Genehmigung des Vermieters!) | single | Eigentümer, Mieter |
| 7* | roomSizes | Wie groß sind jeweils die Räume? (*Optional, in m²) | text | placeholder «Bsp. 20, 35, 16..» |
| 8* | roomHeight | Nennen Sie uns die Ø Raumhöhe in m (*Optional) | text | «Bsp. 2,50» |
| 9* | indoorCount | Wie viele Innengeräte haben Sie geplant? | single | 1, 2, 3, 4, 5, >5 |
| 10* | outdoorCount | Wie viele Außengeräte haben Sie geplant? | single | 1, 2, >2 |
| 11* | outdoorPlace | Wo sollen Ihr(e) Außengerät(e) montiert werden? | multi | Boden stehend; Wandmontage bis 2,5 m Arbeitshöhe; Wandmontage höher 2,5 m Arbeitshöhe; Schrägdach Montage; Flachdach Montage; Sonstiges |
| 12* | pipeLength | Nennen Sie uns die Gesamtleitungsmeter (*Optional, Summe aller Leitungswege) | text | «Bsp. 24 m oder 6+14+3=23» |
| 13* | condensatePumps | Werden Kondenswasserpumpen benötigt? (Optional, wenn ja, wie viele?) | text | «Bsp. 2» |
| 14* | variant | Welche Ausführung/Variante soll es sein? | single | Einsteiger, Mittelklasse, Premium |
| — | contact | IC Klima Service – Ihre neue Klimaanlage. | form | см. 6.3 |

\* Шаги 7–14 показываются только если на шаге 5 выбран «Ja (Experte)». При «Nein» после шага 6 сразу контактная форма.

### 6.3. Контактная форма

| Поле | Обязательное | Примечание |
|---|---|---|
| Anrede | нет | Herr / Frau / Divers / Firma |
| Firmenname | нет | показывается при Anrede = Firma |
| Name | нет | |
| E-Mail | да | валидация email |
| Telefon | нет | выбор страны, по умолчанию Германия (+49) |
| PLZ / Ort | нет | |
| Nachricht | нет | placeholder «Ihre Nachricht & bei Neubau bitte einen Grundriss beifügen» |
| Datenschutz | да | «Ich stimme den Datenschutzbestimmungen zu *» со ссылкой |
| honeypot | — | скрытое поле, при заполнении заявка молча отбрасывается |

Кнопка: **Kostenloses Angebot erhalten**. После успеха: экран «Vielen Dank! Wir melden uns in Kürze bei Ihnen.» Ошибки показываются под полями и общей плашкой.

## 7. Каталог (`/shop`)

- Сетка карточек: фото, марка, название, тип внутреннего блока, мощность охлаждения (кВт), площадь до (м²), класс энергоэффективности, цена «ab … €».
- Фильтры: марка, категория (тип блока), система (Single/Multi/Monoblock/Split), площадь. Фильтры хранятся в query-параметрах URL. Пагинация по 12.
- Карточка товара: галерея, описание, таблица характеристик, цена, кнопка **Angebot anfragen** → модальное окно с контактной формой (6.3), создаёт лид типа PRODUCT с привязкой к товару.
- Онлайн-оплаты, корзины и заказов нет.
- Страницы рендерятся на сервере (SSR/ISR, revalidate 60 с) для SEO.

## 8. Админка (`/admin`)

### 8.1. Доступ

- Вход по email + пароль (`/admin/login`). Первый админ создаётся seed-скриптом из переменных окружения.
- JWT в httpOnly cookie (`SameSite=Lax`, `Secure` в проде), срок 7 дней.
- Все страницы `/admin/*` (кроме login) закрыты middleware.

### 8.2. Разделы

1. **Dashboard** — счётчики: новые заявки, заявки за 7 и 30 дней, всего заявок, активные товары; последние 5 заявок.
2. **Anfragen (заявки)** — таблица: дата, тип, имя, email, телефон, статус. Фильтры: статус, тип, период; поиск по имени/email/телефону; пагинация. Экспорт в CSV (с учётом фильтров).
   Карточка заявки: контакты, все ответы квиза в читаемом виде (вопрос → ответ), товар (если есть), UTM/источник, смена статуса, внутренние заметки, удаление.
   Статусы: Neu, In Bearbeitung, Angebot gesendet, Gewonnen, Verloren.
3. **Produkte** — список (фото, название, марка, категория, цена, активен) + создание/редактирование: название, slug (генерируется), марка, категория, система, мощность охлаждения/обогрева, площадь, класс энергоэффективности, цена от, описание, характеристики (ключ–значение), несколько фото (загрузка, удаление, порядок), активен, порядок сортировки.
4. **Marken** — CRUD: название, slug, логотип, порядок, активна.
5. **Kategorien** — CRUD: название, slug, описание, порядок.

### 8.3. Язык интерфейса

- Админка доступна на двух языках: **немецком** (Deutsch) и **русском**. Публичный сайт остаётся только на немецком.
- Переключение — выпадающее меню с флагами 🇩🇪 / 🇷🇺: на странице входа (в углу карточки), в боковом меню на десктопе и в шапке на мобильных.
- Выбор сохраняется в браузере (localStorage) и применяется сразу, без перезагрузки страницы. По умолчанию — русский, если язык браузера русский, иначе немецкий.
- Переводятся все подписи, кнопки, статусы и типы заявок, сообщения об ошибках, форматы даты и цены, а также вопросы и ответы квиза в карточке заявки.
- Данные, введённые пользователями (названия товаров, марок, тексты заявок), и CSV-экспорт не переводятся.

## 9. Модель данных

```
AdminUser   id, email (unique), passwordHash, name, createdAt
Lead        id, type (QUIZ|HEAT_PUMP|SERVICE|PRODUCT|CONTACT), status (NEW|IN_PROGRESS|OFFER_SENT|WON|LOST),
            salutation, company, name, email, phone, zip, message, answers (Json),
            productId? -> Product, notes, source (Json: utm_*, gclid, referrer, page),
            createdAt, updatedAt
Brand       id, name, slug (unique), logoUrl?, sort, active
Category    id, name, slug (unique), description?, sort
Product     id, slug (unique), title, brandId -> Brand, categoryId -> Category,
            systemType (SINGLE|MULTI|MONOBLOCK|SPLIT), coolingKw?, heatingKw?, areaM2?,
            energyClass?, priceFrom? (Decimal), description, specs (Json: [{label, value}]),
            images (String[]), active, sort, createdAt, updatedAt
```

## 10. REST API (префикс `/api`)

### Публичные

| Метод | URL | Описание |
|---|---|---|
| POST | `/leads` | Создать заявку (rate limit 5/мин с IP, zod-валидация, email-уведомление) |
| GET | `/products` | Список активных товаров: `brand`, `category`, `system`, `minArea`, `page`, `limit` |
| GET | `/products/:slug` | Товар |
| GET | `/brands` | Активные марки |
| GET | `/categories` | Категории |
| GET | `/health` | Проверка работоспособности |

### Админские (требуют cookie)

| Метод | URL | Описание |
|---|---|---|
| POST | `/auth/login` | Вход, ставит cookie |
| POST | `/auth/logout` | Выход |
| GET | `/auth/me` | Текущий админ |
| GET | `/admin/stats` | Счётчики дашборда |
| GET | `/admin/leads` | Список с фильтрами `status`, `type`, `q`, `from`, `to`, `page` |
| GET | `/admin/leads/export.csv` | CSV-экспорт |
| GET/PATCH/DELETE | `/admin/leads/:id` | Заявка, смена статуса/заметок, удаление |
| GET/POST | `/admin/products` | Список (включая неактивные) / создание |
| GET/PATCH/DELETE | `/admin/products/:id` | Товар |
| GET/POST, PATCH/DELETE `/:id` | `/admin/brands` | Марки |
| GET/POST, PATCH/DELETE `/:id` | `/admin/categories` | Категории |
| POST | `/admin/uploads` | Загрузка изображения (jpg/png/webp, до 8 МБ), ресайз до 1600 px, webp |

Файлы отдаются по `/api/uploads/<file>`. Swagger: `/api/docs` (только development).

## 11. Нефункциональные требования

- **Адаптивность:** mobile-first, корректно от 360 px до 1920 px. Квиз на мобильных — как на скриншотах образца.
- **Производительность:** Lighthouse (mobile) ≥ 90 по Performance, SEO, Accessibility; `next/image`, `next/font`.
- **SEO:** уникальные title/description, OpenGraph, `sitemap.xml` (включая товары), `robots.txt`, семантическая разметка, `lang="de"`.
- **DSGVO:** cookie-баннер (только необходимые cookie, без аналитики по умолчанию), страница Datenschutz, обязательное согласие в формах, шрифты подключаются локально (next/font), заявки хранятся в БД на сервере в ЕС.
- **Безопасность:** helmet, rate limiting, honeypot, валидация на клиенте и сервере, argon2, httpOnly cookie, ограничение типов и размера загружаемых файлов, секреты только в `.env`.
- **Дизайн:** синяя палитра (primary `#2F6FED`), белые карточки с мягкими тенями, крупные скругления, градиентные плашки, шрифт Montserrat.

## 12. Переменные окружения

См. `.env.example`: `DATABASE_URL`, `POSTGRES_*`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`, `PUBLIC_SITE_URL`, `API_INTERNAL_URL`, `DOMAIN`.

## 13. Деплой

1. VPS (Ubuntu 22.04+, 2 ГБ RAM), Docker + Docker Compose.
2. DNS A-запись домена на сервер.
3. `cp .env.example .env`, заполнить значения.
4. `docker compose up -d --build` — поднимает postgres, api (применяет миграции при старте и создаёт первого админа из `ADMIN_EMAIL`/`ADMIN_PASSWORD`, если админов ещё нет), web, caddy (автоматический TLS от Let's Encrypt).
5. Опционально: `docker compose exec api node dist/seed.js` — марки, категории и демо-товары.
6. Резервное копирование: ежедневный `pg_dump` + архив volume `uploads`.

## 14. Этапы работ

1. ТЗ (этот документ).
2. Каркас монорепозитория, общие схемы, конфиг квиза.
3. БД и API.
4. Главная страница и квиз.
5. Страницы услуг, формы, юридические страницы, SEO.
6. Каталог.
7. Админка.
8. Docker, деплой, документация.

## 15. Критерии приёмки

- Все блоки главной расположены в указанном порядке, тексты соответствуют разделам 4–5.
- Квиз проходит обе ветки (с «Experte» и без), заявка сохраняется в БД со всеми ответами, приходит email-уведомление.
- Формы услуг и карточки товара создают заявки нужного типа.
- В админке можно войти, просмотреть и отфильтровать заявки, сменить статус, добавить заметку, выгрузить CSV.
- В админке можно создать/изменить/удалить товар с фото, марку, категорию; изменения видны на сайте не позднее чем через 60 с.
- Интерфейс админки переключается между немецким и русским через меню с флагами; выбор сохраняется после перезагрузки.
- Неавторизованный пользователь не может открыть `/admin/*` и вызвать `/api/admin/*`.
- Сайт корректно отображается на мобильных и десктопе, Lighthouse ≥ 90.
- Проект запускается одной командой `docker compose up -d --build`.

## 16. Что предоставляет заказчик

- Логотип, фирменные цвета (если отличаются), фотографии работ.
- Тексты Impressum и Datenschutz, реквизиты компании, телефон, email, адрес.
- Реальный каталог товаров с ценами (или наполнение через админку).
- Доступ к SMTP-ящику и домену.
