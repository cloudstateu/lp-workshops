<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Hosting statycznej aplikacji

W tym laboratorium zobaczysz jak hostować statyczną aplikację internetową na Cloud Storage.

Hostowana aplikacja jest prostą aplikacją Node.js przygotowaną przez Google ([link](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/storage/standard)). Do pobrania danych z Cloud Storage Bucket wykorzystuje bibliotekę [`@google-cloud/storage`](https://googleapis.dev/nodejs/storage/latest/).

W momencie gdy w Cloud Storage Bucket będą znajdowały się dane aplikacja będzie je listowała na stronie głównej. Aplikacja umożliwa upload nowych plików do podanego Cloud Storage Bucket.

---

## Krok 1: Stwórz nowy Cloud Storage

```bash
gsutil mb gs://[YOUR_BUCKET_NAME]
```

## Krok 2: Udostępnij dane w Cloud Storage Bucket publicznie

Poniższa komenda udostępni dane w Bucket do publicznego odczytu (`public-read`)

```bash
gsutil defacl set public-read gs://[YOUR_BUCKET_NAME]
```

## Krok 3: Skonfiguruj aplikacje

1. Przejdź do folderu `/app`
1. Otwórz plik `app.yaml` i uzupełnij wartość zmiennej `GCLOUD_STORAGE_BUCKET` uzupełniając ją nazwą Twojego Storage Bucket
1. Zapisz plik

## Krok 4: Wykonaj wdrożenie aplikacji

1. Utwórz aplikację App Engine. Wybierz region `europe-west3`.

   ```bash
   gcloud app create
   ```

1. Wdróż aplikację

   ```bash
   gcloud app deploy
   ```

1. Wyświetl aplikacje

   ```bash
   gcloud app browse
   ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
