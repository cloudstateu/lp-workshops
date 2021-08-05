<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# mTLS

W tym ćwiczeniu wdrożysz kilka usług na podstawie których przetestujesz zachowanie mTLS

## Krok 1: Konfiguracja środowiska

1. Utwórz namespace

  ```bash
  kubectl create namespace mtls-client && kubectl create namespace mtls-service && kubectl create namespace legacy-client && kubectl create namespace legacy-service
  ```

1. Stwórz plik `httpbin.yaml`
  
  ```bash
  cat > httpbin.yaml <<EOF
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: httpbin
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: httpbin
    labels:
      app: httpbin
  spec:
    ports:
    - name: http
      port: 8000
      targetPort: 80
    selector:
      app: httpbin
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: httpbin
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: httpbin
        version: v1
    template:
      metadata:
        labels:
          app: httpbin
          version: v1
      spec:
        serviceAccountName: httpbin
        containers:
        - image: docker.io/kennethreitz/httpbin
          imagePullPolicy: IfNotPresent
          name: httpbin
          ports:
          - containerPort: 80
  ---
  EOF
  ```

1. Stwórz plik `sleep.yaml`

  ```bash
  cat > sleep.yaml <<EOF
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: sleep
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: sleep
    labels:
      app: sleep
  spec:
    ports:
    - port: 80
      name: http
    selector:
      app: sleep
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: sleep
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: sleep
    template:
      metadata:
        labels:
          app: sleep
      spec:
        serviceAccountName: sleep
        containers:
        - name: sleep
          image: governmentpaas/curl-ssl
          command: ["/bin/sleep", "3650d"]
          imagePullPolicy: IfNotPresent
          volumeMounts:
          - mountPath: /etc/sleep/tls
            name: secret-volume
        volumes:
        - name: secret-volume
          secret:
            secretName: sleep-secret
            optional: true
  ---
  EOF
  ```

1. Wdróż usługi `legacy-*`
  
  ```bash
  kubectl apply -f httpbin.yaml -n legacy-service && kubectl apply -f sleep.yaml -n legacy-client
  ```

1. Wdróż usługi `mtls-*`
  
  ```bash
  kubectl label namespace mtls-client istio-injection- istio.io/rev=asm-196-2 --overwrite && kubectl label namespace mtls-service istio-injection- istio.io/rev=asm-196-2 --overwrite
  ```
  
  ```bash
  kubectl apply -f sleep.yaml -n mtls-client && kubectl apply -f httpbin.yaml -n mtls-service
  ```

1. Sprawdź czy Post zostały utworzone
  
  ```bash
  $ kubectl get pods --all-namespaces

  legacy-client    sleep-854565cb79-mc6c9                                      1/1     Running   0          8m9s
  legacy-service   httpbin-74fb669cc6-6456h                                    1/1     Running   0          8m10s
  mtls-client      sleep-854565cb79-8f5fb                                      2/2     Running   0          43s
  mtls-service     httpbin-74fb669cc6-t6cjd                                    2/2     Running   0          43s
  ```

1. Wykonaj test połączenia pomiędzy uslugami
  
  ```bash
  for from in "mtls-client" "legacy-client"; do
    for to in "mtls-service" "legacy-service"; do
      kubectl exec $(kubectl get pod -l app=sleep -n ${from} -o jsonpath={.items..metadata.name}) -c sleep -n ${from} -- curl "http://httpbin.${to}:8000/ip" -s -o /dev/null -w "sleep.${from} to httpbin.${to}: %{http_code}\n"
    done
  done
  ```


Przejdź do Anthos Service Mesh Dashboard i wyświetl szczegóły usługi `httpbin` w namespace `mtls-*`. Przejdź do zakładki "Connected Services" i zauważ, że komunikacja z usługa w namespace `mtls-*` jest zabezpieczona, natomiast komunikacja z usługa w namespace `legacy-*` ma czerwoną kłódkę. Domyślnie Istio skonfigurowane jest w trybie `PERMISSIVE`, który pozwala na wysłanie requestów do usługi, które są zabezpieczone mTLS jak i tych które są plawintext. mTLS jest używany gdy w requescie zostanie przekazany nagłówek `X-Forwarded-Client-Cert`.

Zauważ, że gdy wykonasz request z namespace `mtls-*` dodawany jest nagłówek

  ```bash
  kubectl exec $(kubectl get pod -l app=sleep -n mtls-client -o jsonpath={.items..metadata.name}) -c sleep -n mtls-client -- curl http://httpbin.mtls-service:8000/headers -s | grep X-Forwarded-Client-Cert
  ```

Zauważ, że gdy wykonasz request z namespace `legacy-*` nagłówek nie jest dodawany
  
  ```bash
  kubectl exec $(kubectl get pod -l app=sleep -n mtls-client -o jsonpath={.items..metadata.name}) -c sleep -n mtls-client -- curl http://httpbin.legacy-service:8000/headers -s | grep X-Forwarded-Client-Cert
  ```

## Krok 2: Zmień tryb komunikacji pomiędzy usługami na `STRICT`
    
1. Wykonaj poniższą komendę (dodaje sprawdzenie mTLS globalnie na klastrze)
  
  ```yaml
  kubectl apply -n istio-system -f - <<EOF
  apiVersion: "security.istio.io/v1beta1"
  kind: "PeerAuthentication"
  metadata:
    name: "mesh-wide-mtls"
  spec:
      mtls:
          mode: STRICT
  EOF
  ```

1. Wykonaj test połączenia pomiędzy usługami ponownie
  ```bash
  for from in "mtls-client" "legacy-client"; do
    for to in "mtls-service" "legacy-service"; do
      kubectl exec $(kubectl get pod -l app=sleep -n ${from} -o jsonpath={.items..metadata.name}) -c sleep -n ${from} -- curl "http://httpbin.${to}:8000/ip" -s -o /dev/null -w "sleep.${from} to httpbin.${to}: %{http_code}\n"
    done
  done
  ```

1. Usuń PeerAuthentication na poziomie klastra
  
  ```bash
  kubectl delete pa mesh-wide-mtls -n istio-system
  ```

1. Dodaj jeden namespace chroniony mTLS i przetesuj komunikację z nim

  ```bash
  kubectl create ns strict-mtls-service
  ```
  
  ```bash
  kubectl label namespace strict-mtls-service istio-injection- istio.io/rev=asm-196-2 --overwrite
  ```
  
  ```bash
  kubectl apply -f httpbin.yaml -n strict-mtls-service
  ```
  
  ```bash
  kubectl apply -n strict-mtls-service -f - <<EOF
  apiVersion: "security.istio.io/v1beta1"
  kind: "PeerAuthentication"
  metadata:
    name: "restricted-mtls"
    namespace: strict-mtls-service
  spec:
      mtls:
          mode: STRICT
  EOF
  ```
  
  ```bash
  for from in "mtls-client" "legacy-client"; do
    for to in "mtls-service" "legacy-service" "strict-mtls-service"; do
      kubectl exec $(kubectl get pod -l app=sleep -n ${from} -o jsonpath={.items..metadata.name}) -c sleep -n ${from} -- curl "http://httpbin.${to}:8000/ip" -s -o /dev/null -w "sleep.${from} to httpbin.${to}: %{http_code}\n"
    done
  done
  ```

## Koniec laboratorium

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
