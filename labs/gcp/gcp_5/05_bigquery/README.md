<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Podstawowe zapytania do BigQuery

W tym laboratorium zobaczysz jak wykonać podstawowe zapytania do BigQuery oraz jak stworzyć nową tabelę i zaimportować do niej dane.

---

## Krok 1: Sprawdź dane dostępne w usłudze BigQuery

Wyświetl usługę BigQuery w przeglądarce (https://console.cloud.google.com/bigquery) i sprawdź zawartość projektu `bigquery-public-dataset`. Spróbuj wyświetlić szczegóły i przykładowe dane dla tabeli `wikipedia`.

## Krok 2: Wyświetl szczegóły tabeli za pomocą narzędzia `bq`

W Cloud Shell wywołaj komendę:

```bash
bq show bigquery-public-data:samples.wikipedia
```

## Krok 3: Wykonaj zapytanie do BigQuery

```bash
bq query --use_legacy_sql=false \
'SELECT
   COUNT(title) AS count
 FROM
   `bigquery-public-data`.samples.wikipedia
 WHERE
   title LIKE "%Linux%"
'
```

```bash
bq query --use_legacy_sql=false \
'SELECT title
 FROM
   `bigquery-public-data`.samples.wikipedia
 WHERE
   title LIKE "%Linux%"
 LIMIT 25
'
```

## Krok 5: Stwórz nową tabele

1. Utwórz nowy _dataset_ `babynames`

   ```bash
   bq mk babynames
   ```

1. Sprawdź czy _dataset_ został utworzony

   ```bash
   $ bq ls

   datasetId
   -----------
   babynames
   ```

1. Przejdź do folderu `/files` i załaduj dane o imionach do tabeli

   ```bash
   $ bq load babynames.names2020 names.txt name:string,gender:string,count:integer

   Upload complete.
   Waiting on bqjob_r57026b3e040b4d05_00000179f4d25652_1 ... (0s) Current status: DONE 
   ```

1. Sprawdź czy tabela została utworzona

   ```bash
   bq ls babynames
   ```

1. Wyświetl detale tabeli

   ```bash
   bq show babynames.names2020
   ```

## Krok 6: Wykonaj kilka zapytań o dane

1. Sprawdź najpopularniejsze imiona żeńskie w 2020 roku

   ```bash
   bq query "SELECT name,count FROM babynames.names2020 WHERE gender = 'F' ORDER BY count DESC LIMIT 5"
   ```

1. Sprawdź najmniej popularne imiona męskie w 2020 roku

   ```bash
   bq query "SELECT name,count FROM babynames.names2020 WHERE gender = 'M' ORDER BY count ASC LIMIT 5"
   ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
