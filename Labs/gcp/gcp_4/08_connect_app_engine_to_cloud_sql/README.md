<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Pobranie danych z Cloud SQL do App Engine

W tym laboratorium nauczysz się łączyć aplikację hostowaną na App Engine z instancją bazy danych w Cloud SQL.
Nauczysz się też jak umożliwić dostęp do bazy danych ze środowisk poza GCP.

---

## Krok 1: Pobranie informacji o bazie danych

```bash
gcloud sql instances describe sql-instance --format="get(connectionName)"
```

## Krok 2: Edycja pliku konfiguracyjnego

1. Przejdź do folderu `/app`
1. Otwórz plik `app.yaml`
1. Podaj wartość zmiennej `CONNECTION_NAME`

## Krok 3: Deploy aplikacji

Wykonaj deploy aplikacji na App Engine:

```bash
gcloud app deploy
```

## Krok 4: Sprawdź czy aplikacja działa i pobiera dane z bazy danych

1. Otwórz stronę główną aplikacji:

   ```bash
   gcloud app browse
   ```

   Powinieneś otrzymać poniższą odpowiedź:

   ```json
   {
     "status": "ok",
     "data": null
   }
   ```

1. Przejdź do strony `/winners` i sprawdź czy otrzymujesz podobną odpowiedź (poniższa odpowiedź jest skrócona dla czytelności):

   ```json
   {
     "status": "ok",
     "data": [
       {
         "wid": 1,
         "year": 1928,
         "age": 44,
         "name": "Emil Jannings",
         "movie": "The Last Command"
       },
       ...
       {
         "wid": 89,
         "year": 2016,
         "age": 41,
         "name": "Leonardo DiCaprio",
         "movie": "The Revenant"
       }
     ]
   }
   ```

## Krok 5: Wykonanie połączenia z bazą danych z lokalnego środowiska

1. Przejdź do folderu `/app`
1. Zainstaluj zależności aplikacji:

   ```bash
   npm i
   ```

1. Pobierz adres IP bazy (wybierz adres o `'type': 'PRIMARY'`)

   ```bash
   gcloud sql instances describe sql-instance --format="get(ipAddresses)"
   ```

1. Zmień kod endpoint `/winners` na:

   ```javascript
   app.get("/winners", async (_, res, next) => {
     try {
       const client = new Client({
         user: "postgres",
         password: "password123",
         database: "lp_test",
         host: "<IP_ADDRESS>",
         port: 5432,
         statement_timeout: 5000,
         query_timeout: 5000,
         connectionTimeoutMillis: 5000,
         idle_in_transaction_session_timeout: 5000,
       });
   
       await client.connect();
       const results = await client.query("SELECT * FROM winners");
       await client.end();
   
       res.json({ status: "ok", data: results.rows });
     } catch (err) {
       next(err);
     }
   });
   ```

1. Uruchom aplikację:

   ```bash
   node index.js
   ```

1. Otwórz przeglądarkę i wyświetl aplikację pod adresem [`http://localhost:8080`](http://localhost:8080). Powinieneś otrzymać odpowiedź:

   ```json
   {
     "status": "ok",
     "data": null
   }
   ```

1. Przejdź na adres [`http://localhost:8080/winners`](http://localhost:8080/winners). Powinieneś otrzymać odpowiedź:

   ```json
   {
   "status": "fail",
   "error": "timeout expired"
   }
   ```

## Krok 6: Umożliwienie połączeń z lokalnego środowiska do Cloud SQL

1. Sprawdź swój publiczny adres IP (możesz to zrobić tutaj: [https://whatismyipaddress.com/](https://whatismyipaddress.com/))
1. Dodaj adres IP jako `authorizedNetwork` dla instancji:

   ```bash
   gcloud sql instances patch sql-instance --authorized-networks=[CIDR]
   ```

   Format wartości CIDR: `<IP_ADDRESS>/32` (podaj swój adres IP)

1. Spróbuj ponownie wyświetlić zawartość strony [`http://localhost:8080/winners`](http://localhost:8080/winners). Powinieneś otrzymać odpowiedź (poniższa odpowiedź jest skrócona dla czytelności):

   ```json
   {
     "status": "ok",
     "data": [
       {
         "wid": 1,
         "year": 1928,
         "age": 44,
         "name": "Emil Jannings",
         "movie": "The Last Command"
       },
       ...
       {
         "wid": 89,
         "year": 2016,
         "age": 41,
         "name": "Leonardo DiCaprio",
         "movie": "The Revenant"
       }
     ]
   }
   ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
