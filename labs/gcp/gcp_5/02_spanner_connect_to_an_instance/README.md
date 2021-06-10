<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Połączenie z bazą danych

W tym ćwiczeniu połączysz się z instancją bazy danych, pobierzesz z niej dane oraz dodasz nowe rekordy.

---

## Krok 1: Uwierzytelnij połączenie ze Spanner z maszyny developerskiej

1. Dodaj nowy Service Account. Przejdź do "IAM & Admin" > "Service Accounts" i kliknij "+ Create Service Account". Podaj poniższe dane.

   ```yaml
   Service account name: sa-spanner
   Role: owner
   ```

1. Wyświetl dodatkowe opcje dla nowego konta (Actions) > Manage keys > Add key > Create new key > wybierz "JSON"
1. Przenieś pobrany plik do [folderu z aplikacją](./files/app). Zmień nazwę pliku na `keyfile.json`.

## Krok 2: Uzupełnij dane konfiguracyjne aplikacji

1. Otwórz plik `index.js` i uzupełnij wartości zmiennych na początku pliku:

   - `PROJECT_ID` - Twoja nazwą projektu Google (np. `training-w5-lpstudent1`)
   - `INSTANCE_ID` - Twoja nazwa instancji usługi Cloud Spanner (np. `lp-spanner`)
   - `DATABASE_ID` - Twoja nazwa instancji bazy danych (np. `lp-database`)

## Krok 3: Uruchom aplikację

1. Uruchom aplikację wywołując z terminala komendę `npm start`.
1. Zweryfikuj czy otrzymujesz odpowiedź podobną do poniższej:

   ```bash
   Query: 3 found.
   [
      { name: 'WinnerId', value: Int { value: '91' } },
      { name: 'Year', value: Int { value: '2018' } },
      { name: 'Age', value: Int { value: '59' } },
      { name: 'FullName', value: 'Gary Oldman' },
      { name: 'MovieName', value: 'Darkest Hour' },
      { name: 'Sex', value: 'M' }
   ]
   [
      { name: 'WinnerId', value: Int { value: '92' } },
      { name: 'Year', value: Int { value: '2019' } },
      { name: 'Age', value: Int { value: '37' } },
      { name: 'FullName', value: 'Rami Malek' },
      { name: 'MovieName', value: 'Bohemian Rhapsody' },
      { name: 'Sex', value: 'M' }
   ]
   [
      { name: 'WinnerId', value: Int { value: '93' } },
      { name: 'Year', value: Int { value: '2020' } },
      { name: 'Age', value: Int { value: '44' } },
      { name: 'FullName', value: 'Joaquin Phoenix' },
      { name: 'MovieName', value: 'Joker' },
      { name: 'Sex', value: 'M' }
   ]
   ```

> Do pobrania danych wykorzystujemy bibliotekę [`@google-cloud/spanner`](https://googleapis.dev/nodejs/spanner/latest/)

## Krok 4: Wstaw dodatkowe dane do bazy danych

1. Uruchom aplikację w trybie wstawiania danych

   ```bash
   npm insert-data
   ```

1. Zweryfikuj czy dane zostały wstawione

   ```bash
   npm start
   ```

> Inne metody wstawiania danych do Cloud Spanner: https://cloud.google.com/spanner/docs/bulk-loading

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
