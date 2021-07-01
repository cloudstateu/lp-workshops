<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Połączenie z Firestore

W tym laboratorium zobaczysz jak zapisać dane do bazy danych oraz jak uruchomić funkcję po zmianie danych w bazie. Zobaczysz też jak możesz testować funkcje lokalnie za pomocą emulatora.

Wykonując ćwiczenia skorzystamy z przygotowanej aplikacji, której wykonamy code review.

Emulator w pełni jego funkcji można użyć tylko lokalnie. Na środowisku GCP możecie otrzymać błędy związane z CORS.

## Krok 0: Zainstaluj zależności (lokalnie)

1. W folderze `/app/functions` zainstaluj zależności komendą:

   ```bash
   npm i
   ```

1. Zbuduj aplikacje

   ```bash
   npm run serve
   ```

   Buduj aplikację po każdej zmianie kodu.

   Deployment na środowisko GCP automatycznie buduje aplikacje, dlatego wcześniej nie musieliśmy tego robić.

1. Przejdź do folderu `/app` i wykonaj komendę:

   ```bash
   firebase emulators:start
   ```

1. Otwórz w przeglądarce stronę `http://localhost:4000/`

## Krok 1: Code Review

W tym kroku wykonam code review kodu aplikacji w folderze `/app`.

## Krok 2: Wykonaj deploy

1. Wykonaj deploy komendą:

   ```bash
   npm run deploy
   ```

1. Utwórz kolekcję w bazie Firebase na środowisku GCP

1. Wywołaj endpoint `/users-list`

1. Spróbuj zmienić status użytkownika:

   ```bash
   curl https://[region]-[project-id].cloudfunctions.net/users-status/update -H "Content-Type: application/json" -d '{"id":[user-id],"status":"active"}'
   ```

1. Wywołaj endpoint `/users-list`

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
