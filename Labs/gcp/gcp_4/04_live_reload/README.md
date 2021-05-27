<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Pobieranie danych z Firestore oraz Live Reload

W tym ćwiczeniu poznasz sposoby pobierania danych z Firestore

---

## Krok 1: Stwórz projekt w Firebase

1. Wejdź na stronę [console.firebase.google.com](https://console.firebase.google.com)
1. Stwórz nowy projekt

   ![](./img/01_create_a_project.png)

1. Potwierdź billing

   ![](./img/02_accept_billing.png)
   ![](./img/03_create_a_project_2.png)

1. Wyłącz Google Analytics

   ![](./img/04_disable_ga.png)

1. Poczekaj na utworzenie projektu

   ![](./img/05_wait_for_creation.png)

1. W rezultacie powinieneś ujrzeć widok:

   ![](./img/06_main_screen.png)

## Krok 2: Skonfiguruj Firestore

1. Przejdź do zakładki Firestore i kliknij "Create database"

   ![](./img/07_firestore.png)

1. Pozostaw domyślne ustawienia i kliknij "Enable"

   ![](./img/08_settings_1.png)
   ![](./img/09_settings_2.png)

1. W efekcie powinieneś zobaczyć poniższy widok

   ![](./img/10_firestore_screen.png)

## Krok 3: Pobierz _credentials_ do połączenia z bazą danych

1. Przejdź do ustawień projektu

   ![](./img/11_project_settings.png)

1. Kliknij w przycisk konfigurowania Web App

   ![](./img/12_select_webapp.png)

1. Nazwij aplikację "My Web App"

   ![](./img/13_name_app.png)

1. W efekcie powinieneś zobaczyć poniższy widok. Na razie nie klikaj "Continue to console" i pozostań na tym widoku. W następnych krokach skopiujemy stąd wartości do połączenia z bazą.

   ![](./img/14_copy_firebase_config.png)

## Krok 4: Dodaj konfigurację Firebase do kodu aplikacji

1. Zastąp:

   ```javascript
   // Zastąp firebaseConfig do swojej usługi
   const firebaseConfig = {
     apiKey: 
     authDomain: 
     projectId: 
     storageBucket: 
     messagingSenderId: 
     appId: 
   };
   ```

   fragmentem kodu skopiowanym z przeglądarki w poprzednim kroku.

1. Zainstaluj zależności aplikacji `npm i`
1. Uruchom aplikację `npm start` i sprawdź czy aplikacja działa. Pracując z Cloud Shell możesz skorzystać z Web Preview:

   ![](./img/15_web_preview.png)

## Krok 5: Dodaj kod pobierający dane z bazy danych

1. Zastąp kod endpoint `/`:

   ```javascript
   app.get("/", async (_, res) => {
     res.json({ status: "ok", data: null });
   });
   ```

   poniższym fragmentem kodu:

   ```javascript
   app.get("/", async (_, res) => {
     let ref = db.collection("users");
     const data = await ref.get();
     const users = data.docs.map(doc => { return {...doc.data(), id: doc.id} });
   
     res.json({ status: "ok", data: users });
   });
   ```

1. Stwórz kolekcję `users` w bazie danych oraz dodaj dowolny dokument

   ![](./img/16_create_collection.png)
   ![](./img/17_create_collection_users.png)
   ![](./img/18_sample_user.png)

1. Sprawdź czy możesz wyświetlić dane z bazy danych wyświetlając stronę aplikacji lub wykonując zapytanie `curl`. W razie problemów sprawdź logi aplikacji.

## Krok 6: Dodaj uprawnienia do wyświetlania dokumentów z bazy danych

1. Przejdź do zakładki Rules dla Firestore

   ![](./img/19_rules.png)

1. Zastąp domyślny kod, który został dodany przez Firestore poniższym:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /{docs=**} {
           allow read, write: if true;
       }
   }
   ```

1. Spróbuj ponownie wyświetlić dane w aplikacji

## Krok 7: Dodaj kod odbierający informacje o zmianie danych w bazie danych

1. Zastąp:

   ```javascript
   // ********************************************** //
   //                                                //
   // Tu wklej kod pozwalający na live reload danych //
   //                                                //
   // ********************************************** //
   ```

   poniższym kodem:

   ```javascript
   const ref = (db).collection("users");
   ref.onSnapshot(
     snapshot => {
       const items = snapshot.docs.map(item => item.data());
       console.log(items);
     },
     e => {
       console.error('Error', e);
     }
   );
   ```

1. Uruchom aplikacje ponownie i zobacz czy w logach wypisała szczegóły obiektu/-ów w kolekcji `users`
1. Ręcznie dodaj zmianę w kolekcji `users` (np. dodaj nowy dokument lub zmień dane wybranego)
1. Sprawdź czy aplikacja wypisała nowe dane

## Krok 8: Dodaj kod pozwalający na dodanie nowych rekordów

1. Poniżej endpoint dla ścieżki `/` dodaj kod:

   ```javascript
   app.post("/users", async (req, res) => {
   let ref = db.collection("users");
   await ref.add(req.body);

   res.sendStatus(200);
   });
   ```

1. Zrestartuj aplikacje
1. W drugim oknie terminala wykonaj request:

   ```javascript
   curl -X POST -H "Content-Type: application/json" -d '{"firstName":"Jane","lastName":"Dee"}' http://localhost:8080/users
   ```

1. Sprawdź czy dane zostały automatycznie zaktualizowane za pomocą mechanizmu live reload

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
