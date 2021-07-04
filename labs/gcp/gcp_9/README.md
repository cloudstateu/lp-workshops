# Cloud Run + CI/CD

## Założenia wstępne

- [X] Istnieje aplikacja Node.js (jeden endpoint `/greet?name=Mac`)
- [X] Aplikacja spakowana jest w kontener

## Uruchomienie aplikacji w Cloud Run

- [X] Uruchomienie usługi na [lokalnym emulatorze Cloud Run](https://cloud.google.com/run/docs/testing/local#cloud-sdk)

   ```bash
   gcloud alpha code dev
   ```

   Lokalne środowisko hostowane jest na lokalnym `minikube` na maszynie programisty. Możemy zobaczyć detale środowiska wykonując `kubectl get all --all-namespaces`. Po uruchomieniu środowiska dodawany jest nowy wpis do `~/.kube/config` (wpis jest usuwany po zastopowaniu środowiska).

- [X] Uruchomienie usługi na Cloud Run zbudowanej na podstawie [lokalnej kopii kodu źródłowego](https://cloud.google.com/run/docs/deploying-source-code)

   ```bash
   gcloud alpha run deploy testy --source . --platform managed --region europe-west3 --allow-unauthenticated
   ```

   Usługa budowana jest na podstawie `Dockerfile` z folderu z aplikacją. Zbudowany obraz przechowywany jest w Container Registry (repozytorium: `cloud-run-source-deploy`). Usługa uruchamiana jest na podstawie obrazu z Container Registry.

- [X] Wylistowanie szczegółów usługi

   ```bash
   gcloud run services list
   ```

   ```bash
   gcloud run services descirbe [NAME]
   ```

## Uruchomienie aplikacji z obrazu w Container Registry

- [X] Zbuduj obraz aplikacji lokalnie i udostępnij go w repozytorium na gcloud

   ```bash
   docker build -t lpw9:latest .
   docker tag lpw9:latest eu.gcr.io/training-w9-lpstudentXX/lpw9:0.1.0
   docker push eu.gcr.io/training-w9-lpstudentXX/lpw9:0.1.0
   gcloud container images list --repository eu.gcr.io/training-w9-lpstudentXX
   gcloud container images list-tags eu.gcr.io/training-w9-lpstudentXX/lpw9
   ```

   Obraz udostępniony jest w rejestrze, którego dane przechowywane w Data Center wewnątrz Unii Europejskiej ([link](https://cloud.google.com/container-registry/docs/pushing-and-pulling#add-registry)).

- [X] Wdróż nową wersję aplikacji na Cloud Run (z obrazu przechowywanego na Container Registry)

   ```bash
   gcloud run deploy testy --image eu.gcr.io/training-w9-lpstudentXX/lpw9:0.1.0 --platform managed --region europe-west3 --allow-unauthenticated
   ```

## Aplikacja budowana jest automatycznie po każdym push do branch `master`

- [ ] Kod aplikacji udostępniony jest w Code Repository
- [ ] Cloud Build wykonuje build aplikacji po każdym push do brancha `master`
- [ ] Wynikiem build jest obraz kontenera udostępniony w Container Registry
- [ ] Nowa wersja aplikacji jest automatycznie deployowana gdy nowy obraz kontenera będzie dostępny

## Aplikacja łączy się z Cloud SQL

- [ ] Istnieje instancja Cloud SQL (schema "actors")
- [ ] Cloud Run łączy się z Cloud SQL za pomocą credentials pobranych z Secret Manager
- [ ] Cloud Run pobiera dane z bazy (endpoint `GET /winners`)

## Aplikacja wdrażana jest na środowisko `prod`

- [ ] Istnieje środowisko `prod` na którym działa aplikacja
- [ ] Nowe wersje aplikacji są wdrażane na środowisko `prod` na żądanie
- [ ] Aplikacja łączy się z inną instancją bazy danych (connection string jest przechowywany w Secret Manager)

## Zwiększenie security

- [ ] Container Registry nie posiada publicznego adresu IP 
- [ ] Obrazy do Container Registry może pushować tylko Code Repository
- [ ] Obrazy w Container Registry są podpisane certyfikatem
- [ ] Cloud Run uruchamia tylko obrazy podpisane certyfikatem
- [ ] Zabezpieczenie aplikacji wymaganym logowaniem

## Monitoring

- [ ] Trace
- [ ] Debug

---

# TODO

- [ ] Enable APIs: run.googleapis.com, cloudbuild.googleapis.com