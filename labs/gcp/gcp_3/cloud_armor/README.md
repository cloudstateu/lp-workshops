<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Cloud Armor

W tym laboratorium zobaczysz jak zabezpieczyć swoją aplikację za pomocą Cloud Armor wyłączając dostęp do niej dla wybranego regionu świata.

---

## Krok 1: Utwórz maszynę do testu

```bash
gcloud compute instances create europe-central2-loadtest \
    --network default \
    --zone europe-central2-a \
    --metadata startup-script='apt -y install siege'
```

```bash
gcloud compute ssh --zone europe-central2-a europe-central2-loadtest
```

Sprawdź czy otrzymujesz odpowiedź 200 OK:

```bash
curl http://LOAD_BALANCER_IP_ADDRESS
```

## Krok 2: Skonfiguruj Cloud Armor do wyłączenia z ruchu maszyny testującej

1. Pobierz IP maszyny

   ```bash
   gcloud compute instances list
   ```

1. W wyszukiwarce GCP wpisz "Network Security" i przejdź na jego stronę
1. Z menu po lewej stronie wybierz "Cloud Armor"
1. Kliknij w "Create policy" i podaj następującą konfiguracje:

   ```bash
   Name: denylist-loadtest-vm
   Default action rule: Allow
   ```

1. W następnym kroku dodaj regułę (klikając "+ Add Rule") i podaj jej konfiguracje:

   ```bash
   Condition: (IP maszyny europe-central2-loadtest)
   Action: Deny
   Deny status: 403
   Priority: 1000
   ```

1. Wybierz zasób których chcesz zabezpieczyć ("Apply policy to targets"). Wybierz odpowiedni Backend Service.
1. Kliknij "Create". Jako rezultat powinineneś otrzymać nową regułę o nazwie `denylist-loadtest-vm` z dwoma Rules i jednym Target

## Krok 3: Sprawdź odpowiedź którą otrzymasz wykonując request z maszyny testującej

1. Zaloguj się do maszyny do testu i wykonaj request:

   ```bash
   curl http://LOAD_BALANCER_IP_ADDRESS
   ```

   Powinieneś otrzymać odpowiedź wskazującą na brak uprawnień (403 Forbidden).

## Krok 4: Dodaj regułę blokującą ruch z wybranego regionu

1. W Cloud Armor dodaj kolejną regułę (na wzór poprzedniej). W polu _Condition_ wybierz "Advanced" i wklej poniższy kod:

   ```bash
   origin.region_code=="PL"
   ```

   `Priority` ustaw na 999, a kod odpowiedzi na 404.

## Krok 5: Sprawdź czy ruch z Twojej przeglądarki jest zablokowany

W przeglądarce spróbuj wejść na stronę aplikacji (po adresie IP). Jeśli wykonujesz request z sieci znajdującej się w Polsce powinieneś otrzymać odpowiedź 404 Not Found.

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
