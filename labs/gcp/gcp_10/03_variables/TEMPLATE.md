<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Zmienne

W tym ćwiczeniu dowiesz się jak dodać zmienne do twoich skryptów Terraform

## Krok 1: Stwórz plik ze zmiennymi

1. Stwórz plik `variables.tf` i uzupełnij go poniższym kodem

    ```bash
    variable "project" { }

    variable "credentials_file" { }

    variable "region" {
      default = "europe-west"
    }

    variable "zone" {
      default = "europe-west3-a"
    }
    ```

## Krok 2: Zaktualizuj plik z definicją infrastruktury

1. Zastąp wartości konfiguracyjne dla Google Provider zdefiniowanymi zmiennymi

    ```bash
    ...
    provider "google" {
      credentials = file(var.credentials_file)

      project = var.project
      region  = var.region
      zone    = var.zone
    }
    ...
    ```

## Krok 3: Utwórz plik z wartościami zmiennych

1. Utwórz plik `terraform.tfvars`
1. Uzupełnij go poniższym kodem

    ```bash
    credentials_file = "~/key.json"
    ```

1. Utwórz zasoby na subskrypcji

    ```bash
    terraform apply
    ```

1. Zauważ, że musisz podać tylko nazwę projektu na którym mają zostać utworzone zasoby (tę wartość też możesz przenieść do pliku `terraform.tfvars`)

## Krok 4: Pobierz szczegółowe wartości o utworzonych zasobach

1. Utwórz plik `outputs.tf` i wklej poniższy kod

    ```bash
    output "ip" {
      value = google_compute_instance.vm_instance.network_interface.0.network_ip
    }
    ```

1. Ponownie wykonaj `terraform apply` i zwróć uwagę, że adres IP został wypisany
1. Użyj komendy `terraform output`, żeby wyświetlić adres IP

## Krok 5: Usuń utworzoną infrastrukturę

1. Wykonaj komendę `terraform destroy`

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
