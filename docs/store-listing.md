# Google Play listing

Category: Lifestyle. Content rating questionnaire: no violence, no user-generated content shared
with others, no gambling. Tag the app as entertainment; every description ends with the disclaimer.

Privacy policy URL: `https://faceitall123qwe-hub.github.io/taroluna/privacy.html`
Account deletion URL: `https://faceitall123qwe-hub.github.io/taroluna/delete-account.html`

## Polski (domyślny)

**Tytuł (30):** TaroLuna: Tarot i Karta Dnia

**Krótki opis (80):** Codzienna karta tarota, rozkłady i znaczenia 78 kart. 3 rozkłady za darmo.

**Pełny opis:**

Wyciągnij kartę dnia i sprawdź, co mówi o dzisiejszym dniu.

TaroLuna to spokojna, elegancka talia tarota w Twoim telefonie: pełna talia Rider-Waite-Smith
(78 kart), jasne opisy znaczeń prostych i odwróconych oraz rozkłady na różne pytania.

• Karta dnia z przypomnieniem o 9:00
• Rozkłady: Przeszłość–Teraźniejszość–Przyszłość, Krzyż Celtycki, Tak/Nie, Związek, Kariera,
  Cień, Prognoza na miesiąc i inne
• Znaczenie każdej karty w miłości, pracy i zdrowiu
• Prognozy dla znaków zodiaku
• Historia rozkładów z własnymi notatkami
• Działa po polsku, angielsku, rosyjsku i ukraińsku

3 pierwsze rozkłady są darmowe. Potem możesz kupić pakiet rozkładów albo subskrypcję bez limitu.

Aplikacja służy rozrywce i autorefleksji. Nie zastępuje porady lekarskiej, prawnej ani finansowej.

## English

**Title:** TaroLuna: Tarot & Daily Card

**Short description:** Daily tarot card, spreads and meanings of all 78 cards. 3 free readings.

**Full description:**

Draw your card of the day and see what it says about today.

TaroLuna is a calm, beautiful tarot deck on your phone: the full Rider-Waite-Smith deck (78 cards),
clear upright and reversed meanings, and spreads for every kind of question.

• Daily card with a 9:00 reminder
• Spreads: Past–Present–Future, Celtic Cross, Yes/No, Relationship, Career Path, Shadow Self,
  Monthly Forecast and more
• Meaning of every card for love, work and health
• Zodiac forecasts
• Reading history with your own notes
• English, Polish, Russian and Ukrainian

Your first 3 readings are free. After that, buy a reading pack or go unlimited with a subscription.

For entertainment and self-reflection. Not a substitute for medical, legal or financial advice.

## Русский

**Название:** TaroLuna: Таро и Карта дня

**Краткое описание:** Карта дня, расклады таро и значения всех 78 карт. 3 расклада бесплатно.

**Полное описание:**

Вытяни карту дня и узнай, что она говорит о сегодняшнем дне.

TaroLuna — спокойная и красивая колода таро в телефоне: полная колода Райдера–Уэйта (78 карт),
понятные значения в прямом и перевёрнутом положении и расклады на любой вопрос.

• Карта дня с напоминанием в 9:00
• Расклады: Прошлое–Настоящее–Будущее, Кельтский крест, Да/Нет, Отношения, Карьера, Тень,
  Прогноз на месяц и другие
• Значение каждой карты в любви, работе и здоровье
• Прогнозы по знакам зодиака
• История раскладов с вашими заметками
• Русский, украинский, польский и английский

Первые 3 расклада бесплатно. Дальше — пакет раскладов или подписка без ограничений.

Приложение предназначено для развлечения и самоанализа и не заменяет медицинскую, юридическую или
финансовую консультацию.

## Українська

**Назва:** TaroLuna: Таро і Карта дня

**Короткий опис:** Карта дня, розклади таро та значення всіх 78 карт. 3 розклади безкоштовно.

**Повний опис:**

Витягни карту дня й дізнайся, що вона каже про сьогодні.

TaroLuna — спокійна й красива колода таро у твоєму телефоні: повна колода Райдера–Вейта (78 карт),
зрозумілі прямі та перевернуті значення і розклади на будь-яке питання.

• Карта дня з нагадуванням о 9:00
• Розклади: Минуле–Теперішнє–Майбутнє, Кельтський хрест, Так/Ні, Стосунки, Кар'єра, Тінь,
  Прогноз на місяць та інші
• Значення кожної карти в коханні, роботі та здоров'ї
• Прогнози за знаками зодіаку
• Історія розкладів із власними нотатками
• Українська, російська, польська та англійська

Перші 3 розклади безкоштовні. Далі — пакет розкладів або підписка без обмежень.

Застосунок призначений для розваги та самоаналізу й не замінює медичну, юридичну чи фінансову
консультацію.

## Data safety form

| Question | Answer |
|---|---|
| Collects or shares user data | Collects, does not share |
| Encrypted in transit | Yes |
| Users can request deletion | Yes (in app + deletion URL) |
| Personal info → Email address, Name | Collected, required, purpose: Account management |
| Financial info → Purchase history | Collected, required, purpose: App functionality |
| App activity → Other user-generated content (readings, notes) | Collected, optional, App functionality |
| Device or other IDs (push token) | Collected, optional, App functionality |
| Ads | None |

## Products to create in Play Console (must match the webhook)

| Product ID | Type | Readings |
|---|---|---|
| `taroluna_starter_8` | In-app (consumable) | 8 |
| `taroluna_popular_25` | In-app (consumable) | 25 |
| `taroluna_value_60` | In-app (consumable) | 60 |
| `taroluna_monthly` | Subscription | unlimited |
| `taroluna_annual` | Subscription | unlimited |

Prices: see the monetization plan (PLN 19.99 / 49.99 / 99.99, 14.99 per month, 99.99 per year).

## Release checklist

1. `npx supabase login` then `npx supabase db push` (applies 006 + 007).
2. `npx supabase functions deploy revenuecat-webhook --no-verify-jwt` and
   `npx supabase secrets set REVENUECAT_WEBHOOK_SECRET=<random string>`.
3. RevenueCat → Integrations → Webhooks: URL
   `https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook`, Authorization header
   `Bearer <same string>`. Create the products above and attach the subscriptions to one entitlement.
4. Put the production RevenueCat public Android key into `eas.json` → `build.production.env`
   (it currently holds a `test_` key, which cannot take real payments).
5. GitHub repo → Settings → Pages → branch `main`, folder `/docs` (for the two URLs above).
6. `npx eas-cli login` then `npx eas-cli build -p android --profile production`.
7. Play Console: new app, upload the .aab to Internal testing, fill this listing, Data safety,
   content rating, then promote to Production. New personal developer accounts need a closed test
   with 12 testers for 14 days before production.
