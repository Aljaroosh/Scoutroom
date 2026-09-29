# Marcus Högvall innehåll, tier-gating och admin


---

## Vad jag har byggt

### Innehållssidor (`/content/:slug`)

Varje scoutrapport, klubbrapport eller artikel har en egen sida, till exempel `/content/exklusiv-anfallare`. All information hämtas från databasen via backenden (`GET /api/content/:slug`), inget är hårdkodat i frontenden.

Sidan kan hamna i fem olika lägen:

| Läge | När | Vad användaren ser |
|---|---|---|
| Upplåst | Användaren har rätt nivå | Hela artikeln |
| Kräver uppgradering | Inloggad men för låg nivå (403) | En låsruta med vilken nivå som krävs och en knapp till nivåsidan |
| Kräver inloggning | Inte inloggad (401) | En låsruta med "Skapa konto" och "Logga in" |
| Finns inte | Fel adress (404) | "Sidan finns inte" |
| Fel | Servern är nere eller liknande | "Något gick fel" |

### Tier-gating – säkerheten ligger i backenden

 Om användaren har för låg nivå svarar den `403` och skickar **aldrig** med själva innehållet. Jag har kontrollerat det i DevTools: på en låst sida finns ingen `content` i svaret. Frontenden visar bara det som backenden redan har bestämt.

Nivåerna jämförs med en rangordning (`BASIC = 1`, `PLUS = 2`, `FULL = 3`), så att en FULL-användare automatiskt får se allt som PLUS och BASIC får se.

### Uppgradera-rutan (`UpgradePrompt`)

När en sida är låst visas en ruta som säger vilken nivå som krävs, vad den kostar och vad man får. Knappen leder till nivåsidan som Person 2 har byggt, där man går igenom låtsasbetalningen.

Rutan har två lägen. En inloggad användare uppmanas att uppgradera. En utloggad besökare har ingen nivå att uppgradera från, så den uppmanas att skapa ett konto i stället.

### Markdown

Innehållet skrivs i markdown, så admin kan göra rubriker, fetstil, listor och tabeller. Tabeller var viktiga eftersom scoutrapporter innehåller mycket statistik. Jag använder `react-markdown` och `remark-gfm`.

Jag valde markdown i stället för en WYSIWYG-editor av säkerhetsskäl. En WYSIWYG-editor sparar HTML, och att visa HTML som någon annan har skrivit öppnar för XSS-attacker. `react-markdown` visar aldrig rå HTML. Jag testade det genom att lägga in `<script>alert('xss')</script>` i en artikel, och det visades bara som text.

### Admin-panel (`/admin`)

En administratör kan skapa nya innehållssidor och välja vilken nivå som krävs för att se dem. Formuläret har fält för rubrik, slug, beskrivning, innehåll, bild-URL och nivå.

Några saker jag har lagt till för att det ska vara lätt att använda:

- **Sluggen skapas automatiskt från rubriken.** "Nästa stjärna på mittfältet" blir `nasta-stjarna-pa-mittfaltet`. Om admin ändrar sluggen själv slutar den att uppdateras automatiskt.
- **Validering direkt i formuläret** med samma regler som backenden har. Då ser admin felen innan formuläret skickas.
- **Efter sparning** visas en länk till den nya sidan och formuläret töms.

Valideringen finns alltså på två ställen. Den i frontenden är för att det ska vara smidigt att använda. Den i backenden är för säkerheten, eftersom man kan skicka anrop direkt till API:t och gå runt formuläret.

### Skydd av admin-sidan (`AdminRoute`)

`ProtectedRoute` hade redan byggts, som kräver inloggning. Jag byggde en egen `AdminRoute` som ligger inuti den och bara släpper igenom användare med rollen `ADMIN`. Jag ville inte ändra i Person 2:s komponent, så de två skydden kan kombineras utan att vi rör varandras kod.

Det här skyddet är bara för användarupplevelsen. Den riktiga säkerheten är att backenden kontrollerar att användaren är admin innan en sida sparas.

### Lokal databas med Docker

Jag lade till `backend/docker-compose.yml` så att alla i gruppen kan köra en egen PostgreSQL lokalt. Då kan vi testa att skapa och ta bort saker utan att förstöra den gemensamma databasen.

---

## Filer jag har skapat eller ändrat

| Fil | Vad den gör |
|---|---|
| `frontend/src/pages/ContentPage.tsx` | Innehållssidan med alla lägen |
| `frontend/src/pages/ContentPage.css` | Stil för artiklar, inklusive markdown och tabeller |
| `frontend/src/components/UpgradePrompt.tsx` + `.css` | Uppgradera-rutan |
| `frontend/src/pages/AdminPage.tsx` + `.css` | Formuläret för nya sidor |
| `frontend/src/components/AdminRoute.tsx` | Släpper bara igenom admin |
| `frontend/src/lib/content.ts` | Översätter backendens svar (401/403/404) till tydliga lägen |
| `frontend/src/lib/slugify.ts` | Gör om en rubrik till en slug |
| `frontend/src/lib/access.ts` | Rangordning av nivåerna |
| `frontend/src/lib/api.ts` | La till `contentApi` (hämta och skapa sidor) |
| `frontend/src/types.ts` | La till typerna för innehållssidor |
| `frontend/src/App.tsx` | La till routerna `/content/:slug` och `/admin` |
| `frontend/.env.example` | Visar vilka miljövariabler frontenden behöver |
| `backend/docker-compose.yml` | Lokal PostgreSQL |

---

## Så här kör du projektet lokalt

### 1. Databasen

Starta Docker Desktop först. Sedan i `backend/`:

```bash
docker compose up -d
docker exec scoutroom-db createdb -U scoutroom scoutroom_shadow
```

### 2. Backenden

Skapa `backend/.env` utifrån `backend/.env.example`:

```dotenv
PORT=3000
DATABASE_URL=postgresql://scoutroom:scoutroom@localhost:5433/scoutroom
SHADOW_DATABASE_URL=postgresql://scoutroom:scoutroom@localhost:5433/scoutroom_shadow
JWT_SECRET=en-lång-slumpmässig-sträng
```

Sedan i `backend/`:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Kontrollera att `http://localhost:3000/api/health` svarar.

### 3. Frontenden

Skapa `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Sedan i `frontend/`:

```bash
npm install
npm run dev
```

Öppna `http://localhost:5173`.

### 4. Testkonton

Registrera konton på sidan (eller med `POST /api/auth/register`). För att ge ett konto en annan nivå eller göra det till admin öppnar du `npx prisma studio` i `backend/` och ändrar `membershipLevel` eller `role` på användaren.

Jag har testat med ett konto per nivå plus ett admin-konto.

---

## Så testar du min del

| Test | Förväntat |
|---|---|
| Öppna en innehållssida utloggad | "Logga in för att läsa" |
| Öppna en FULL-sida som BASIC | Låsruta som nämner Chief Scout |
| Samma sida, DevTools → Network → Response | `Upgrade required` och ingen `content` |
| Öppna en FULL-sida som FULL | Hela artikeln |
| Öppna `/admin` som vanlig användare | "Ingen behörighet" |
| Skapa en sida som admin | Grönt meddelande med länk till sidan |

---

## Kända brister och det som är kvar

Inte är klart:

- **Admin kan inte läsa FULL-innehåll** om admin-kontot själv har en lägre nivå. Backenden kontrollerar bara nivån och inte rollen.
- **Låsrutan visar ingen rubrik** för sidan man inte får läsa, eftersom backendens 403-svar inte innehåller någon förhandsvisning.
- **Om en slug redan finns** svarar backenden med ett allmänt fel (500) i stället för 409, så formuläret kan inte säga exakt vad som är fel.
- **Admin kan bara skapa sidor**, inte redigera eller ta bort. Kravet är att kunna lägga till, så jag prioriterade det.
- **Scoutlistorna** (funktionen som blir bättre ju högre nivå man har) är inte byggda än.
- **Deployment** är inte gjord än.

---