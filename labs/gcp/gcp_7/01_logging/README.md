<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Custom logs

## Krok 1: Utwórz maszynę wirtualną

1. Utwórz maszynę wirtualną z domyślnymi ustawieniami (OS: Debian)
1. Zaloguj się na maszynę SSH

## Krok 2: Skopiuj aplikację

1. Wykonaj zapytanie:

   ```bash
   gsutil cp gs://netapps/netcorelogger/* .
   ```

## Krok 3: Doinstaluj zależności na VM

1. Wykonaj poniższe komendy

   ```bash
   wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
   sudo mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
   wget -q https://packages.microsoft.com/config/debian/9/prod.list
   sudo mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
   sudo chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
   sudo chown root:root /etc/apt/sources.list.d/microsoft-prod.list
   ```

1. Zainstaluj SDK .NET Core 3.1

   ```bash
   sudo apt-get update
   sudo apt-get install apt-transport-https
   sudo apt-get update
   sudo apt-get install dotnet-sdk-3.1
   ```

## Krok 4: Uruchom aplikację

1. Uruchom aplikację poniższą komendą

   ```bash
   dotnet NetCoreLogger.dll
   ```

## Krok 5: Sprawdź czy powstał plik z logami aplikacji

1. Wyświetl zawartość pliku konfiguracyjnego:

   ```bash
   cat log4net.config
   ```

1. Sprawdź czy istnieje plik z logami w miejscu wskazanym przez konfigurację
1. Wyświetl zawartość pliku z logami

## Krok 6: Zainstaluj fluentd

1. Zainstaluj agenta fluentd

   ```bash
   curl -sSO https://dl.google.com/cloudagents/install-logging-agent.sh
   sudo bash install-logging-agent.sh
   ```

## Krok 7: Dodaj konfigurację własnej aplikacji do fluentd

1. Wyświetl zawartość katalogu `/etc/google-fluentd/config`
1. Dodaj nowy plik `netlogger.config` i uzupełnij go poniższą treścią:

   ```
   <source>
   @type tail
   format none
   path <log-path>
   pos_file /var/lib/google-fluentd/pos/<pos-file-name>.pos
   read_from_head true
   tag <tag>
   </source>
   ```

1. Zrestartuj agenta fluentd

   ```bash
   sudo service google-fluentd restart
   ```

## Krok 8: Uruchom aplikację i wyświetl logi w Operations Logging

1. Uruchom aplikację
1. Przejdź do Operations Logging i spróbuj znaleźć logi dla swojej maszyny wirtualnej
1. Na liście logów powinny pojawić się najnowsze logi z aplikacji:

   ![img](./img/logs.png)

---

**End of lab**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>