<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Data Import

TBA

---

## Krok 1: Utwórz nową tabele

1. Zaloguj się do utworzonej wcześniej instancji SQL

   ```bash
   gcloud sql connect sql-instance --user=postgres
   ```

   (hasło to `password123`)

1. Zaloguj się do utworzonej wcześniej bazy:

   ```bash
   \c lp_test
   ```

1. Utwórz nową tabelę:

   ```sql
   CREATE TABLE winners (
      wid SERIAL PRIMARY KEY,
      year INTEGER,
      age INTEGER,
      name varchar(500),
      movie varchar(500)
   );
   ```

## Krok 2: Przekopiuj plik z danymi na Cloud Storage Bucket

1. Utwórz nowy Cloud Storage Bucket:

```bash
gsutil mb gs://[BUCKET_NAME]
```

1. Przejdź do folderu `/files`
1. Przekopiuj plik z danymi:

   ```bash
   gsutil cp data.csv gs://[BUCKET_NAME]
   ```

## Krok 3: Zaimportuj dane do bazy danych

1. Wykonaj komendę:

   ```bash
   gcloud sql import csv sql-instance gs://[BUCKET_NAME]/data.csv --database=lp_test --table=winners
   ```

1. Zaloguj się do bazy danych i sprawdź czy dane zostały zaimportowane poprawnie

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
