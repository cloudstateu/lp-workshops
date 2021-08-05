<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Instalacja ASM na klastrze GKE

> Ćwiczenia wykonaj w GCP Cloud Shell

## Krok 1: Inicjalizacja środowiska

1. Sprawdź czy Twój `PROJECT_ID` jest poprawnie ustawiony

  ```shell
  gcloud config list
  ```

1. Ustaw zmienne środowiskowe
   
  ```shell
  export PROJECT_ID=$(gcloud config get-value project)
  export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
  export CLUSTER_NAME=lbcluster
  export CLUSTER_ZONE=europe-west3-b
  export WORKLOAD_POOL=${PROJECT_ID}.svc.id.goog
  export MESH_ID="proj-${PROJECT_NUMBER}"
  ```
  
  ```shell
  echo $PROJECT_ID $PROJECT_NUMBER $CLUSTER_NAME $CLUSTER_ZONE $WORKLOAD_POOL $MESH_ID
  ```

1. Sprawdź czy Twoje konto posiada role Owner (potrzebna do poprawnego skonfigurowania klastra; łatwiej nadać role Owner niż wyklikać odpowiednie uprawnienia)

  ```shell
  gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:user:$(gcloud config get-value core/account 2>/dev/null)"
  ```

1. Utwórz klaster GKE (**zajmuje kilka minut**)

  ```bash
  gcloud config set compute/zone ${CLUSTER_ZONE}
  ```

  ```shell
  gcloud beta container clusters create ${CLUSTER_NAME} \
    --machine-type=n1-standard-4 \
    --num-nodes=4 \
    --workload-pool=${WORKLOAD_POOL} \
    --enable-stackdriver-kubernetes \
    --subnetwork=default \
    --release-channel=regular \
    --labels mesh_id=${MESH_ID}
  ```
  
  ```shell
  gcloud container clusters list
  ```

## Krok 2: Rejestracja klastra do Anthos

Utworzony klaster GKE nalezy dołączyć do puli zasobów zarządzanych przez Anthos (na poprzednich ćwiczeniach robiliśmy to ręcznie, teraz zrobimy to za pomocą Cloud Console)

1. Sprawdź czy masz uprawnienia do wykonania wszystkich operacji na klastrze

  ```shell
  kubectl auth can-i '*' '*' --all-namespaces
  ```

1. Utwórz Service Account, którego użyje GKE Connect, przypisz mu rolę `gkehub.connect` i pobierz klucz z danymi uwierzytelniającymi.

  ```bash
  gcloud iam service-accounts create connect-sa
  ```
  
  ```javascript
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:connect-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/gkehub.connect"
  ```
  
  ```javascript
  gcloud iam service-accounts keys create connect-sa-key.json \
    --iam-account=connect-sa@${PROJECT_ID}.iam.gserviceaccount.com
  ```
  
  ```javascript
  $ ls
  connect-sa-key.json
  ```

1. Zarejestruj klaster

  Przed wykonaniem tego kroku możesz sprawdzić, że klaster nie jest podłączony do puli zasobów zarządzanych przez Anthos.
  
  Jako część rejestracji klastra w Anthos na klastrze zostanie wdrożony pod z usługą Connect Agent (w namespace `gke-connect`). Sprawdź, że przed wykonaniem rejestracji klastra na klastrze nie ma tej usługi
  
      ```javascript
      kubectl get all --all-namespaces
      ```
  Aby zarejestrować klaster wykonaj ponizszą komendę:
  
  ```javascript
  gcloud container hub memberships register ${CLUSTER_NAME}-connect \
    --gke-cluster=${CLUSTER_ZONE}/${CLUSTER_NAME}  \
    --service-account-key-file=./connect-sa-key.json
  ```

  Sprawdź, że klaster jest widoczny w Anthos oraz że Connect Agent jest wdrożony na Anthos
  
## Krok 3: Instalacja Anthos Service Mesh (ASM)

Google dostarcza gotowy skrypt do instalacji ASM na GKE ([więcej informacji w dokumentacji](https://cloud.google.com/service-mesh/docs/scripted-install/reference#understanding_the_script)). Nalezy go zmodyfikować i włączyć przesyłanie informacji o trackingu (domyslnie wyłaczone).

  ```javascript
  curl https://storage.googleapis.com/csm-artifacts/asm/install_asm_1.9 > install_asm
  ```

  ```javascript
  curl https://storage.googleapis.com/csm-artifacts/asm/install_asm_1.9.sha256 > install_asm.sha256
  ```
  
  ```javascript
  chmod +x install_asm
  ```
  
  ```javascript
  cat > tracing.yaml <<EOF
  apiVersion: install.istio.io/v1alpha1
  kind: IstioOperator
  spec:
    meshConfig:
      enableTracing: true
      defaultConfig:
        tracing:
          sampling: 100
    values:
      global:
         proxy:
           tracer: stackdriver
  EOF
  ```

  ```javascript
  ./install_asm \
    --project_id $PROJECT_ID \
    --cluster_name $CLUSTER_NAME \
    --cluster_location $CLUSTER_ZONE \
    --mode install \
    --enable_all \
    --output_dir asm \
    --custom_overlay ./tracing.yaml
  ```

  Powyzsza komenda wykonuje instalacje ASM, włącza domyślny Mesh CA, włącza niezbędne Google APIs (Stackdriver), ustawia IAM i GKE Workload Identity.

1. Oznacz namespace `default` jako gotowy do wstrzykiwania Sidecar Proxy

  ```javascript
  kubectl label namespace default  istio-injection- istio.io/rev=asm-196-2 --overwrite
  ```

  Mozesz zignorować komunikat `[...] istio-injection not found [...]`. ubernetes informuje w ten sposob, ze nie znalazl label `istio-injection`, którą mógłby usunąć.

## Krok 4: Wdrożenie aplikacji na klaster

Aplikacja którą będziemy wdrażali jest sample od Google. Pobraliśmy ją wraz z plikami dla ASM. Pliki YAML dla deploymentów aplikacji znajdują się w folderze `/asm/istio-1.9.6-asm.2/samples/bookinfo/platform/kube/*`

1. Wykonaj wdrożenie
  
  ```javascript
  $ kubectl apply -f /asm/istio-1.9.6-asm.2/samples/bookinfo/platform/kube/bookinfo.yaml

  service/details created
  serviceaccount/bookinfo-details created
  deployment.apps/details-v1 created
  service/ratings created
  serviceaccount/bookinfo-ratings created
  deployment.apps/ratings-v1 created
  service/reviews created
  serviceaccount/bookinfo-reviews created
  deployment.apps/reviews-v1 created
  deployment.apps/reviews-v2 created
  deployment.apps/reviews-v3 created
  service/productpage created
  serviceaccount/bookinfo-productpage created
  deployment.apps/productpage-v1 created
  ```
  
1. Poczekaj aż wszystkie usługi będą gotowe

  ```bash
  kubectl get pods -w
  ```

1. Wyświetl szczegóły wybranego Pod i zauważ, że wstrzyknięty został kontener `istio-proxy`

## Krok 5: Udostępnij aplikacje publicznie poza klastrem

1. Sprawdź plik konfigurujący nowe obiekty K8s. Zauważ, że są to standardowe obiekty Istio.

  ```javascript
  cat /asm/istio-1.9.6-asm.2/samples/bookinfo/networking/bookinfo-gateway.yaml
  ```

1. Wdróz obiekty definiowane przez `bookinfo-gateway.yaml`

1. Sprawdź, że obiekty zostały utworzone

  ```javascript
  kubectl get gateway && kubectl get virtualservice
  ```

1. Znajdź publiczny adres IP przypisany do Istio Ingress Gateway

  ```javascript
  kubectl get svc istio-ingressgateway -n istio-system
  ```

1. Przypisz publiczny adres IP do zmiennej środowiskowej
  
  ```javascript
  export GATEWAY_URL=<EXTERNAL-IP>
  ```

1. Wykonaj request do klastra z terminala
  
  ```javascript
  curl -I http://${GATEWAY_URL}/productpage
  ```

1. Wyświetl stronę w przeglądarce
  
  Odśwież stronę klika razy i zaobserwuj jak zmienia się komponent związany z ratingiem (gwiazdki). Istnieją trzy wersje aplikacji w której gwiazdek może nie być, mogą być czarne lub mogą być czerwone. Zmiana sposobu wyświetlania komponentu związana jest z mechanizmem Load Balancing i strategią routingu Round Robin.

## Krok 6: Prosty Load Test

1. W Cloud Shell zainstaluj narzędzie `siege`

```javascript
sudo apt install siege
```

1. Zaincjalizuj test (test trwa 30 sekund)

  ```javascript
  $ siege http://${GATEWAY_URL}/productpage -t 30s

  ** SIEGE 4.0.4
  ** Preparing 25 concurrent users for battle.
  The server is now under siege...
  Lifting the server siege...
  Transactions:                   7091 hits
  Availability:                 100.00 %
  Elapsed time:                  29.86 secs
  Data transferred:             372.62 MB
  Response time:                  0.10 secs
  Transaction rate:             237.47 trans/sec
  Throughput:                    12.48 MB/sec
  Concurrency:                   24.91
  Successful transactions:        7091
  Failed transactions:               0
  Longest transaction:            1.20
  Shortest transaction:           0.02
  ```
  
1. Sprawdź wyniki testu w Anthos Service Mesh Dashboard

  Menu > Anthos > Service Mesh
  
  - Anthos > Service Mesh > Topology View (preview) (w prawym górnym rogu)
  - Na każdym node kliknij "Expand", żeby zobaczyć więcej szczegółów usługi (Services, Deployments, Pods)

1. Wyświetl szczegóły usługi `productpage`
  
  - Wyświetl zakładkę Metrics
  - Wyświetl zakładkę Connected Services
  - Wyświetl topologię systemu
  
## Koniec laboratorium

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
