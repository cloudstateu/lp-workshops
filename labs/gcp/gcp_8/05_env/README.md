<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Zmienne konfiguracyjne

W tym laboratorium zobaczysz jak ustawić zmienne konfiguracyjne na środowisku lokalnym i GCP.

## Krok 1: Stwórz plik konfiguracyjny

1. W folderze `/app/functions` stwórz plik konfiguracyjny:

   ```bash
   touch .runtimeconfig.json
   ```

1. Wklej poniższy JSON do pliku:

   ```bash
   {
     "admin": {
       "uid": "1"
     }
   }
   ```

1. Uruchom aplikacje i wywołaj endpoint `/test`. Sprawdź czy zwraca `"1"`.

## Krok 2: Wykonaj deploy

1. Wykonaj deploy komendą:

   ```bash
   npm run deploy
   ```

1. Sprawdź odpowiedź na endpoint `/test`

## Krok 3: Ustaw zmienną środowiskową na GCP

1. Wykonaj komendę:

   ```bash
   firebase functions:config:set admin.uid="2"
   ```

1. Wykonaj ponowny deploy

1. Uruchom aplikacje i wywołaj endpoint `/test`. Sprawdź czy zwraca `"2"`.

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
