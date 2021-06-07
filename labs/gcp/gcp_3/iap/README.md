<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Identity-Aware Proxy

W tym laboratorium zabezpieczysz aplikację webową dodatkowym uwierzytelnieniem Google.

---

## Krok 1: Uruchom Cloud Shell i pobierz kod

1. Sklonuj repozytorium Git do swojego Cloud Shell

   ```bash
   git clone https://github.com/googlecodelabs/user-authentication-with-iap
   ```

## Krok 2: Wykonaj deploy aplikacji

1. Przejdź do sklonowanego repozytorium i folderu `1-HelloWorld`
1. Wykonaj poniższą komendę. Wybierz numer dla regionu `europe-west3` i potwierdź chęć deploy.

   ```bash
   gcloud app deploy
   ```

1. Otwórz aplikację:

   ```bash
   gcloud deploy browse
   ```

## Krok 3: Zabezpiecz aplikację Identity-Aware Proxy

1. W wyszukiwarce GCP wpisz "Identity-Aware Proxy" i wybierz usługę
1. Jeśli potrzebujesz uruchom API (_Enable API_) i kliknij "Go to Identity-Aware Proxy"
1. Na ekranie "Configure Consent Screen" wybierz opcję "Internal"
1. Na ekranie "OAuth consent screen" podaj następujące dane:

   ```bash
   App name: IAP Example
   User support email: (wybierz swój)
   Application home page: (adres aplikacji z `https://`)
   Authorized domains: (adres aplikacji bez `http(s)://` oraz końcowego `/`)
   Developer contact infromation: (podaj swój w domenie @chmurowisko.pl)
   ```

1. Na ekranie "Scopes" kliknij "Add or Remove Scopes" i wybierz `openid`. W efekcie `openid` powinno pojawić się w _non-sensitive scopes_.
1. Wróć na stronę główną Identity-Aware Proxy i znajdź swoją usługę. W kolumnie IAP kliknij przełącznik aby uruchomić usługę.

## Krok 4: Zweryfikuj czy aplikacja jest zabezpieczona

1. Przejdź na stronę swojej aplikacji i sprawdź czy pojawia się strona logowania Google.
1. Zweryfikuj czy po zalogowaniu się kontem otrzymasz informacje, że nie masz uprawnień.

## Krok 5: Dodaj użytkownika, który będzie mógł wyświetlić Twoją aplikację

1. Przejdź do strony głównej Identity-Aware Proxy
1. Na liście aplikacji znajdź swoją i kliknij w checkbox obok jej nazwy.
1. W bocznym menu kliknij "+ Add memeber"
1. Podaj swój adres e-mail i wybierz rolę "IAP-secured Web App User" z menu "Cloud IAP"
1. Zapisz ustawienia

## Krok 6: Zweryfikuj czy aplikacja jest zabezpieczona

1. Odśwież stronę aplikacji i sprawdź czy możesz wyświetlić aplikację. Nie powinieneś otrzymać widoku z informacją o braku uprawnień.
1. Jeśli nadal otrzymujesz informację o braku uprawnień odczekaj 2 minuty i spróbuj ponownie.
1. Jeśli nadal otrzymujesz informację o braku uprawnień wymuś wylogowanie użytkownika i spróbuj zalogować się ponownie. Aby wymusić wylogowanie użytkownika w pasku adresu dodaj ścieżkę:

   ```bash
   /_gcp_iap/clear_login_cookie
   ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
