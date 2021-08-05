<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Service Observability

W tym ćwiczeniu sprawdzimy w jaki sposób można zbierać i analizować dane telemetryczne z Kubernetes i usług uruchomionych na Service Mesh.

W tym celu wykorzystamy GCP Operations Suite. GKE z ASM wypisze logi do Cloud Logging, metryki do Cloud Monitoring i trace (Distributed Tracing) do Cloud Trace. Można używać tych narzędzi wraz ASM Dashboard do zrozumienia i namierzenia problemów z usługami.

## Krok 1: Wdrożenie aplikacji testowej

1. Utwórz nowy namespace

  ```javascript
  kubectl create ns boutique
  ```

1. Enable sidecar injection
   
  ```javascript
  kubectl label namespace default istio-injection- istio.io/rev=asm-196-2 --overwrite
  ```

1. Deploy nowej apliakcji
   
  ```javascript
  kubectl apply -n boutique -f https://raw.githubusercontent.com/GoogleCloudPlatform/microservices-demo/master/release/kubernetes-manifests.yaml
  ```

1. Upewnij się, ze każdy pod ma Sidecar. Gdyby tak nie było zrestartuj deploymenty
  
## Krok 2: Rekonfiguracja Istio
  
1. Utwórz nowy plik z konfiguracją Istio  

  ```javascript
  cat > boutique-istio.yaml <<EOF
  apiVersion: networking.istio.io/v1alpha3
  kind: Gateway
  metadata:
    name: frontend-gateway
  spec:
    selector:
      istio: ingressgateway # use Istio default gateway implementation
    servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
      - "*"
  ---
  apiVersion: networking.istio.io/v1alpha3
  kind: VirtualService
  metadata:
    name: frontend-ingress
  spec:
    hosts:
    - "*"
    gateways:
    - frontend-gateway
    http:
    - route:
      - destination:
          host: frontend
          port:
            number: 80
  ---
  apiVersion: networking.istio.io/v1alpha3
  kind: ServiceEntry
  metadata:
    name: allow-egress-googleapis
  spec:
    hosts:
    - "accounts.google.com" # Used to get token
    - "*.googleapis.com"
    ports:
    - number: 80
      protocol: HTTP
      name: http
    - number: 443
      protocol: HTTPS
      name: https
  ---
  apiVersion: networking.istio.io/v1alpha3
  kind: ServiceEntry
  metadata:
    name: allow-egress-google-metadata
  spec:
    hosts:
    - metadata.google.internal
    addresses:
    - 169.254.169.254 # GCE metadata server
    ports:
    - number: 80
      name: http
      protocol: HTTP
    - number: 443
      name: https
      protocol: HTTPS
  ---
  apiVersion: networking.istio.io/v1alpha3
  kind: VirtualService
  metadata:
    name: frontend
  spec:
    hosts:
    - "frontend.boutique.svc.cluster.local"
    http:
    - route:
      - destination:
          host: frontend
          port:
            number: 80
  ---
  EOF
  ```

  ```javascript
  kubectl apply -n boutique -f ./boutique-istio.yaml
  ```

1. Konfiguracja deploymentu

  ```javascript
  kubectl patch -n boutique deployments/productcatalogservice -p '{"spec":{"template":{"metadata":{"labels":{"version":"v1"}}}}}'
  ```
  
1. Wyświetl usługi na dashboard GKE
  
  - Menu > Kubernetes Engine > Workloads > (filtruj po namespace `boutique`)
  - Menu > Kubernetes Engine > Services & Ingress > (znajdź `frontend-external`) > (wyświetl w przeglądarce po Extrnal IP)

## Krok 3:  Wykorzystanie usług Cloud Operations
    
### Cloud Logging    
    
  - Menu > Logging > Logs Explorer    
  
1. Stwórz nowe query w celu wyszukania logów z informacjami

  - GKE Cluster Operations - informacje związane z operacjami na usłudze GKE (__API requests made to the Google GKE service for things like creating a GKE cluster.__)
  - Kubernetes Cluster - logi związane z działaniem klastra (__API requests made to the master__)
  - Kubernetes Node - logi związane z operacjami wykonywanymi z Node (__worker node logs__)
  - Kubernetes Pod - logi z Podów (probe results and container restarts)
  - Kubernetes Container - logi z kontenerów (__log entries scraped from the running containers on the cluster__)

### Cloud Monitoring

  - Menu > Monitoring > Dashboard (jeśli nie działa spróbuj wcześniej przejść na Home projektu) > (wybierz GKE)
  - Menu > Monitoring > Metrics explorer

### Cloud Trace

  - Menu > Trace > Trace List
  
## Krok 4: Canary release

1. Pobierz repozytorium z przykładową aplikacją

  ```javascript
  git clone https://github.com/GoogleCloudPlatform/istio-samples.git \
  ~/istio-samples
  ```
  
  ```javascript
  cd istio-samples/istio-canary-gke/canary
  ```
  
  ```javascript
  kubectl apply -n boutique -f destinationrule.yaml -f productcatalog-v2.yaml -f vs-split-traffic.yaml
  ```

## Krok 5: Ustaw SLO

  - Navigation > Anthos > Service Mesh > Dashboard > `productscatalogservice` > Health > "+ Create SLO"

  ```bash
  - Metric: Latency
  - Request-based
  - Threshold: 1000 ms
  - Period length: Calendar day
  - Performance goal: 99.5%
  ```

  Czy SLO jest spełnione?

## Krok 6: Analiza wykresów

1. Przejdź do zakładki "Metrics" i sprawdź wykres Latency (breakdown by workload source)

1. Przejdź do Cloud Traces i znajdź usługę, która odpowiada wyjątkowo dlugo

1. Wykonaj Rollback do poprzedniej wersji aplikacji
  
  ```javascript
  kubectl delete -n boutique -f destinationrule.yaml -f productcatalog-v2.yaml -f vs-split-traffic.yaml
  ```

1. Odczekaj około minuty i sprawdź czy czasy odpowiedzi zostały zmniejszone oraz czy SLO się podnioslo
  
## Koniec laboratorium

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
