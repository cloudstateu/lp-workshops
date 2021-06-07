<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Retention Policy & Lifecycle Rules

TBA

---

## Krok 1: Stwórz nowy Cloud Storage

```bash
gsutil mb gs://[YOUR_BUCKET_NAME]
```

## Krok 2: Skonfiguruj Retention Policy

Poniższa komenda blokuje możliwość usunięcia pliku przez 120 sekund.

```bash
gsutil retention set 120s gs://[YOUR_BUCKET_NAME]
```

Wyświetl szczegóły Retention Policy:

```bash
gsutil retention get gs://[YOUR_BUCKET_NAME]
```

## Krok 3: Dodaj plik i wyświetl jego szczegóły

1. Wgraj plik komendą:

   ```bash
   gsutil cp [PLIK] gs://[YOUR_BUCKET_NAME]
   ```

1. Wyświetl szczegóły pliku. Zwróć uwagę na wartość property `Retention Expiration`.

   ```bash
   gsutil ls -L gs://[YOUR_BUCKET_NAME]/[PLIK]
   ```

## Krok 4: Spróbuj usunąć plik

1. Spróbuj usunąć plik

   ```bash
   gsutil rm gs://[YOUR_BUCKET_NAME]/[PLIK]
   ```

   Jeśli nie minęły 2 minuty od upload pliku powinieneś otrzymać odpowiedź:

   ```bash
   $ gsutil rm ...

   Removing gs://tmb-bl/lifecycle.json...
   AccessDeniedException: 403 Object 'tmb-bl/lifecycle.json' is subject to bucket's retention policy and cannot be deleted, overwritten or archived until 2021-05-25T08:55:06.792064-07:00
   ```

1. Odczekaj 2 minuty i spróbuj ponownie usunąć plik - tym razem powinno być to możliwe.

## Krok 5: Skonfiguruj Lifecycle Rules

1. Przejdź do folderu `/files`
1. Wyświetl zawartość pliku `lifecycle.json`
1. Dodaj Lifecycle Rule:

   ```bash
   gsutil lifecycle set ./lifecycle.json gs://[YOUR_BUCKET_NAME]
   ```

1. Wyświetl szczegóły Lifecycle Rule:

   ```bash
   gsutil lifecycle get gs://[YOUR_BUCKET_NAME]
   ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
