<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Traffic Management

W tym laboratorium zaobserwujesz w jaki sposób mozesz sterowac ruchem w ASM.

Przypadki uzycia Traffic Manager

    - Traffic splitting (kierownie ruchu do różnych wersji uslugi)
    - Timeouts (określenie maksymalnego czasu oczekiwania na odpowiedz)
    - Retry (liczba powtórzeń request, który się nie powiódł (np. timeout lub 500)).
    - Fault injection - delay - sposób na wstrzyknięcie timeouts w odpowiedz usługi na dowolny request (określamy % requestów, które mają otrzymać błędną odpowiedź)
    - Fault injection - aborts - zamiast timeout dostajemy odpowiedź != 200 OK (np. 400)
    - Conditional routing na podstawie label lub header - dopuszczenie ruchu z określonych Pod lub z wybranym header (np. do nowej wersji aplikcji).

> W tym laboratroium pracujemy na aplikacji Bookinfo

## Krok 1: Weryfikacja środowiska

1. Sprawdź czy wszystkie pody działają i maja wstrzyknięty Sidecar

    ```bash
    $ kubectl get pods

    NAME                              READY   STATUS    RESTARTS   AGE
    details-v1-79f774bdb9-k6b4v       2/2     Running   0          3h6m
    productpage-v1-6b746f74dc-qzlpq   2/2     Running   0          3h6m
    ratings-v1-b6994bb9-zkn4t         2/2     Running   0          3h6m
    reviews-v1-545db77b95-lcdpt       2/2     Running   0          3h6m
    reviews-v2-7bf8c9648f-4gw27       2/2     Running   0          3h6m
    reviews-v3-84779c7bbc-t4549       2/2     Running   0          3h6m
    ```
    
    ```bash
    $ kubectl get svc

    NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
    details       ClusterIP   10.3.250.157   <none>        9080/TCP   3h7m
    kubernetes    ClusterIP   10.3.240.1     <none>        443/TCP    3h17m
    productpage   ClusterIP   10.3.246.38    <none>        9080/TCP   3h7m
    ratings       ClusterIP   10.3.240.8     <none>        9080/TCP   3h7m
    reviews       ClusterIP   10.3.244.79    <none>        9080/TCP   3h7m
    ```

## Krok 2: Ingress gateway

W naszym ćwiczeniu mamy już utworzony obiekt `istio-ingressgateway`, który posiada publiczny adres IP (pochodzący z Load Balancera GCP).

1. Wyświetl szczegóły `istio-ingressgateway`

    ```bash
    kubectl describe svc istio-ingressgateway -n istio-system
    ```

1. Znajdź adres IP gateway

    ```bash
    kubectl get svc istio-ingressgateway -o=jsonpath='{.status.loadBalancer.ingress[0].ip}' -n istio-system
    ```

1. Wykonaj Load Test za pomocą siege

    ```bash
    siege http://<EXTERNAL-IP>/productpage -c 5 -d 5
    ```

1. W drugim oknie Cloud Console ustaw zmienne środowiskowe

    ```bash
    export CLUSTER_NAME=lbcluster
    export CLUSTER_ZONE=europe-west3-b
    export GCLOUD_PROJECT=$(gcloud config get-value project)
    gcloud container clusters get-credentials $CLUSTER_NAME \
        --zone $CLUSTER_ZONE --project $GCLOUD_PROJECT
    export GATEWAY_URL=$(kubectl get svc istio-ingressgateway \
    -o=jsonpath='{.status.loadBalancer.ingress[0].ip}' -n istio-system)
    ```

1. Wyświetl szczegóły gateway
  
    ```bash
    kubectl describe gateway bookinfo-gateway
    ```

1. Wyświetl szczegóły VirtualService

    ```bash
    kubectl describe virtualservice bookinfo
    ```

1. Upewnij się, że Service `productpage` odpowiada gdy wywołany lokalnie z innego Pod w klastrze

    ```bash
    kubectl exec -it \
      $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') \
      -c ratings -- curl productpage:9080/productpage \
      | grep -o "<title>.*</title>"
    ```

1. Wylistuj Service dostępne w klastrze
  
    ```bash
    kubectl get svc
    ```
  
1. Utwórz nowy plik z DestinationRule dla każdego Service

    ```bash
    cat > destinationrule.yaml <<EOF
    apiVersion: networking.istio.io/v1alpha3
    kind: DestinationRule
    metadata:
      name: productpage
    spec:
      host: productpage
      subsets:
      - name: v1
        labels:
          version: v1
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: DestinationRule
    metadata:
      name: reviews
    spec:
      host: reviews
      subsets:
      - name: v1
        labels:
          version: v1
      - name: v2
        labels:
          version: v2
      - name: v3
        labels:
          version: v3
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: DestinationRule
    metadata:
      name: ratings
    spec:
      host: ratings
      subsets:
      - name: v1
        labels:
          version: v1
      - name: v2
        labels:
          version: v2
      - name: v2-mysql
        labels:
          version: v2-mysql
      - name: v2-mysql-vm
        labels:
          version: v2-mysql-vm
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: DestinationRule
    metadata:
      name: details
    spec:
      host: details
      subsets:
      - name: v1
        labels:
          version: v1
      - name: v2
        labels:
          version: v2
    ---
    EOF
    ```

1. Zweryfikuj, że DestinationRule zostały utworzone

    ```bash
    kubectl get dr
    ```

1. Przejdź do GCP > Anthos > Service Mesh > (reviews) > Traffic
  
    Sprawdź, że ruch jest równomiernie rozkładany pomiędzy dostępne wersje aplikacji

## Krok 3: Skieruj ruch tylko do jednej wersji aplikacji

1. Stwórz nowy plik `destinationrule-v1.yaml`

    ```bash
    cat > destinationrule-v1.yaml <<EOF
    apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: productpage
    spec:
      hosts:
      - productpage
      http:
      - route:
        - destination:
            host: productpage
            subset: v1
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: reviews
    spec:
      hosts:
      - reviews
      http:
      - route:
        - destination:
            host: reviews
            subset: v1
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: ratings
    spec:
      hosts:
      - ratings
      http:
      - route:
        - destination:
            host: ratings
            subset: v1
    ---
    apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: details
    spec:
      hosts:
      - details
      http:
      - route:
        - destination:
            host: details
            subset: v1
    ---
    EOF
    ```

1. Wdróż nową konfiguracje DestinationRule
1. Odczekaj do 5 minut i sprawdź zakładkę Infrastructure dla `reviews` Service. Jeden z Podow powinien przejąć ruch, podczas gdy dwa pozostałe nie powinny ich otrzymywać.


## Koniec laboratorium

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
