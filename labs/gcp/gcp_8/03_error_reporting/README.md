<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Error Reporting

W tym laboratorium stworzysz funkcję, która zwraca wyjątek i zobaczysz jak wizualizowane są błędy w Cloud Operations Error Reporting

## Krok 1: Stwórz funkcję zwracającą wyjątek

1. Stwórz nową funkcję w pliku `app/functions/src/index.ts`:

   ```typescript
   export const failure = functions.https.onRequest((req, resp) => {
     try {
       throw new Error("Expected error!");
     } catch (err) {
       functions.logger.error(err);
       resp.sendStatus(500);
     }
   });
   ```

1. Wdróż nową funkcję na GCP:

   ```bash
   firebase deploy --only functions
   ```

1. Wykonaj request do funkcji:

   ```bash
   curl https://[region]-[project-id].cloudfunctions.net/failure
   ```

   Funkcja powinna zwrócić błąd `500 Internal Server Error`

## Krok 2: Sprawdź w jaki sposób został zwizualizowany błąd

1. Sprawdź w jaki sposób zwizualizowany jest log w:

   - [Operations Logging](https://console.cloud.google.com/logs)
   - [Error Reporting](https://console.cloud.google.com/errors)

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
