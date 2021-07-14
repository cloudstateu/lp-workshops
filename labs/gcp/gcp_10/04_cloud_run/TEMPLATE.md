<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Utworzenie Cloud Run z NGINX

W tym ćwiczeniu dowiesz się w jaki sposób stworzyć Cloud Run za pomocą Terraform

## Krok 1: Udostępnij wybrany obraz w Container Registry

1. Wykonaj poniższe komendy (zastąp `training-w10-lpstudentXX` własną wartością)

    ```bash
    docker pull nginx
    docker tag nginx gcr.io/training-w10-lpstudentXX/nginx
    docker push gcr.io/training-w10-lpstudentXX/nginx
    gcloud container images list --project training-w10-lpstudentXX
    ```

# Krok 2: Utwórz Terraform dla Cloud Run

1. Utwórz nowy folder (np. `~/cloudrun`). Wewnątrz nowego folderu utwórz plik `main.tf` i wklej poniższą treść (zastąp `training-w10-lpstudentXX` własną wartością; upewnij się, że `provider "google" {}` jest poprawnie skonfigurowany),

    ```bash
    terraform {
      required_providers {
        google = {
          source  = "hashicorp/google"
          version = "3.75.0"
        }
      }
    }

    provider "google" {
      credentials = file("~/key.json")

      project = "training-w10-lpstudentXX"
      region  = "europe-west3"
      zone    = "europe-west3-a"
    }

    resource "google_cloud_run_service" "default" {
      name     = "cloudrun-service"
      location = var.region

      template {
        spec {
          containers {
            image = "gcr.io/training-w10-lpstudentXX/nginx"
            
            ports {
              container_port = 80
            }
          }
        }
      }

      traffic {
        percent         = 100
        latest_revision = true
      }
    }
    ```

1. Utwórz usługę za pomocą Terraform
1. Zweryfikuj szczegóły usługi przechowywane w stanie Terraform. Znajdź adres URL usługi. Zweryfikuj czy usługa działa.

1. Jeśli usługa zwraca odpowiedź `403 Forbidden` dodaj do Terraform poniższy kod. 

    ```bash
    data "google_iam_policy" "noauth" {
      binding {
        role = "roles/run.invoker"
        members = [
          "allUsers",
        ]
      }
    }

    resource "google_cloud_run_service_iam_policy" "noauth" {
      location    = google_cloud_run_service.default.location
      project     = google_cloud_run_service.default.project
      service     = google_cloud_run_service.default.name

      policy_data = data.google_iam_policy.noauth.policy_data
    }
    ```

1. Konta z rolą Owner mają możliwość edytować IAM. Dodaj rolę Owner dla Service Account.

    ```bash
    gcloud projects add-iam-policy-binding training-w10-lpstudentXX \
      --member=serviceAccount:sa-terraform@training-w10-lpstudentXX.iam.gserviceaccount.com --role=roles/owner
    ```

1. Zaktualizuj usługę za pomocą Terraform
1. Zweryfikuj szczegóły usługi przechowywane w stanie Terraform. Znajdź adres URL usługi. Zweryfikuj czy usługa działa.

## Krok 3: Usuń infrastrukturę

1. Usuń utworzoną infrastrukturę wykonując poniższy kod

    ```bash
    terraform destroy
    ```

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
