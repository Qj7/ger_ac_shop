# IC Klima Service — сайт продажи и монтажа кондиционеров

Сайт на немецком языке: лендинг с квиз-планером, страницы услуг, витрина товаров (без онлайн-оплаты, только запрос предложения) и простая админка для заявок и каталога.

Полное техническое задание: [`docs/TZ.md`](docs/TZ.md).

## Стек

| Часть | Технологии |
| --- | --- |
| Фронтенд | Next.js 16 (App Router), React 19, Tailwind CSS 4, react-hook-form + zod |
| Бэкенд | NestJS 11, Prisma 6, PostgreSQL 16, JWT в httpOnly-cookie, sharp для фото |
| Общий код | `packages/shared`: zod-схемы, конфиг квиза, справочники |
| Деплой | Docker Compose: postgres, api, web, Caddy (автоматический HTTPS) |

## Структура

```
apps/
  web/            Next.js: сайт (app/(site)) и админка (app/admin)
  api/            NestJS: REST API под /api, Prisma-схема и миграции, seed
packages/
  shared/         Общие схемы валидации, шаги квиза, константы
docs/TZ.md        Техническое задание
docker-compose.yml        Продакшен
docker-compose.dev.yml    Только PostgreSQL для локальной разработки
Caddyfile                 Обратный прокси: /api/* → api, остальное → web
```

## Локальная разработка

Нужны Node.js 22+, pnpm 9 (`corepack enable`) и Docker.

```bash
cp .env.example .env          # если порт 5432 занят — поменяйте POSTGRES_PORT и порт в DATABASE_URL
pnpm install
pnpm db:up                    # PostgreSQL в Docker
pnpm db:migrate               # применить миграции
pnpm db:seed                  # марки, категории, демо-товары
pnpm dev                      # web: http://localhost:3000, api: http://localhost:4000
```

- Админка: http://localhost:3000/admin — логин и пароль из `ADMIN_EMAIL` / `ADMIN_PASSWORD` (админ создаётся автоматически при первом старте API).
- Swagger (только вне продакшена): http://localhost:4000/api/docs
- Без `SMTP_HOST` письма о новых заявках не отправляются, а пишутся в лог API.

Полезные команды: `pnpm typecheck`, `pnpm build`, `pnpm db:studio` (Prisma Studio).

## Демо на GitHub Pages

Демо: https://qj7.github.io/ger_ac_shop/ (админка — `/admin`, логин `demo@ic-klima-service.de` / `demo1234`).

GitHub Pages отдаёт только статические файлы, поэтому API и PostgreSQL там не работают. Для демо есть отдельный режим сборки (`NEXT_PUBLIC_DEMO=1`):

- Next.js собирается как статический экспорт (`output: 'export'`) с `basePath` = имя репозитория.
- Вместо NestJS-API работает его копия в браузере (`apps/web/lib/demo/handler.ts`): те же маршруты, zod-схемы и ответы. Данные хранятся в `localStorage` посетителя, поэтому заявки и правки в админке видны только в его браузере. Кнопка «Zurücksetzen» в жёлтой плашке возвращает исходные данные.
- Исходные данные — тот же каталог, что и в `pnpm db:seed` (`packages/shared/src/demo-catalog.ts`), плюс несколько примеров заявок.
- Страницы товаров из каталога пререндерятся; товары и заявки, созданные в демо, открываются через `/shop/_/?slug=…`, `/admin/leads/_/?id=…` и `/admin/products/_/?id=…`.

Деплой выполняет `.github/workflows/pages.yml` при каждом push в `main`: собирает демо и публикует `apps/web/out` в ветку `gh-pages`. Если после первого запуска сайт не открывается, проверьте в **Settings → Pages**, что источник — ветка `gh-pages`, папка `/ (root)`.

Локальная сборка демо:

```bash
pnpm --filter @ic/shared build
NEXT_PUBLIC_BASE_PATH=/ger_ac_shop pnpm --filter @ic/web build:demo   # результат в apps/web/out
```

Продакшен-сборка (`pnpm build`, Docker) этот режим не затрагивает.

## Деплой на VPS

1. Сервер с Ubuntu 22.04+ (от 2 ГБ RAM), установленные Docker и Docker Compose, открытые порты 80 и 443.
2. A-запись домена указывает на IP сервера.
3. Скопировать репозиторий на сервер и создать `.env`:
   ```bash
   cp .env.example .env
   ```
   Обязательно заполнить:
   - `DOMAIN` и `PUBLIC_SITE_URL` (например `ic-klima-service.de` и `https://ic-klima-service.de`);
   - `POSTGRES_PASSWORD` — только буквы и цифры (`openssl rand -hex 24`), он подставляется в URL подключения;
   - `JWT_SECRET` — не короче 32 символов (`openssl rand -hex 32`), иначе API не запустится;
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — первый администратор;
   - `SMTP_*`, `MAIL_FROM`, `MAIL_TO` — для уведомлений о заявках.

   `DATABASE_URL`, `API_INTERNAL_URL`, `UPLOAD_DIR` и `COOKIE_SECURE` для Docker задаются в `docker-compose.yml`, значения из `.env` для них не используются.
4. Запуск:
   ```bash
   docker compose up -d --build
   ```
   API при старте применяет миграции и создаёт администратора, Caddy получает сертификат Let's Encrypt.
5. Опционально — демо-каталог:
   ```bash
   docker compose exec api node dist/seed.js
   ```

Обновление: `git pull && docker compose up -d --build`.

Логи: `docker compose logs -f api web caddy`.

### Резервные копии

```bash
# База данных
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > backup-$(date +%F).sql.gz
# Загруженные фото
docker run --rm -v ic-klima_uploads:/data -v "$PWD":/backup alpine tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

Рекомендуется запускать оба шага ежедневно по cron и хранить копии вне сервера.

## Что заменить перед запуском

- **Данные компании** — `apps/web/lib/site.ts`: название, телефон, e-mail, адрес, часы работы. Сейчас там заглушки.
- **Impressum и Datenschutz** — `apps/web/app/(site)/impressum/page.tsx` и `datenschutz/page.tsx`: тексты-заглушки, нужны юридически проверенные тексты.
- **Логотип** — `apps/web/components/site/Logo.tsx`.
- **Фото товаров** — демо-товары используют SVG-иллюстрации; реальные товары и фото добавляются через админку.
- **Пароль администратора** — сменить `ADMIN_PASSWORD` до первого запуска (пароль задаётся только при создании админа).

## Админка

- **Dashboard** — новые заявки, статистика за 7/30 дней.
- **Anfragen** — фильтры по статусу, типу, дате и поиску; карточка заявки с ответами квиза, источником (UTM), статусом и заметками; экспорт CSV (Excel, разделитель `;`).
- **Produkte** — создание и редактирование товаров: цены, характеристики, несколько фото (автоматически сжимаются в WebP), видимость в магазине.
- **Marken / Kategorien** — справочники для фильтров магазина и блока марок на главной.
