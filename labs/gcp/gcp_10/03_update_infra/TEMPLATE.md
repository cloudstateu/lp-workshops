<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Aktualizacja infrastruktury

W tym laboratorium dodasz Compute Engine Instance (VM) do swojej infrastruktury, połączysz ją z istniejącą siecią i utworzysz ją na subskrypcji GCP za pomocą Terraform.

## Krok 1: Dodaj Compute Engine Instance

1. W pliku zawierającym tworzoną sieć wklej poniższy kod

    ```bash
    resource "google_compute_instance" "vm_instance" {
      name         = "terraform-instance"
      machine_type = "f1-micro"

      boot_disk {
        initialize_params {
          image = "debian-cloud/debian-9"
        }
      }

      network_interface {
        network = google_compute_network.vpc_network.name
        access_config {
        }
      }
    }
    ```

    Zwróc uwagę w jaki sposób łączysz maszynę wirtualną z istniejącą siecią.

1. Utwórz zasoby na subskrypcji

    ```bash
    terraform apply
    ```

    Zwróc uwagę w jaki sposób referencja do istniejącej sieci została zastąpiona jej faktyczną nazwą.

1. Sprawdź czy instancja została utworzona

    ```bash
    gcloud compute instances list
    ```

## Krok 2: Dodaj tagi do utworzonej instancji

1. Zmodyfikuj kod zasobu `google_compute_instance` `vm_instance` ([dokumentacja zasobu](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance#example-usage))

    ```bash
    resource "google_compute_instance" "vm_instance" {
      ...
      machine_type = "f1-micro"

      tags = ["foo", "bar"]

      boot_disk {
        ...
      }

      ...
    }
    ```

1. Zaktualizuj instancję na subskrypcji za pomocą Terraform
1. Sprawdź czy tagi zostały dodane do instancji

    ```bash
    gcloud compute instances describe terraform-instance --zone=europe-west3-a
    ```

1. Sprawdź stan Terraform

    ```bash
    terraform show
    ```

## Krok 3: Wprowadź inwazyjną zmianę

1. Zmień obraz z którego uruchamiasz maszynę wirtualną

    ```bash
    ...
    boot_disk {
      initialize_params {
        image = "cos-cloud/cos-stable"
      }
    }
    ...
    ```

1. Wykonaj aktualizację instancji za pomocą Terraform. Zwróć uwagę, że zmiana obrazu wymaga zastąpienia instancji nową.

    ```bash
    $ terraform apply

    Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
    -/+ destroy and then create replacement

    Terraform will perform the following actions:

      # google_compute_instance.vm_instance must be replaced
    -/+ resource "google_compute_instance" "vm_instance" {
      ...
      boot_disk {
        ...

        ~ initialize_params {
            ~ image  = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-9-stretch-v20210701" -> "cos-cloud/cos-stable" # forces replacement
            ...
          }
      }

    ...
    ```

1. Sprawdź szczegóły instancji. Zwróć uwagę w jaki sposób zmieniły się szczegóły instancji.

    ```bash
    # id instancji uległo zmianie
    gcloud compute instances describe terraform-instance --zone=europe-west3-a | grep id:
    # instancja używa cloud-cos
    gcloud compute instances describe terraform-instance --zone=europe-west3-a | grep cos
    ```

1. Sprawdź stan Terraform. Porównaj go z poprzednim stanem.

    ```bash
    terraform show
    ```

## Krok 4: Usuń infrastrukturę

1. Wykonaj poniższą komendę

    ```bash
    terraform destroy
    ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
