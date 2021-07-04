# Cloud Run + CI/CD

## Założenia wstępne

- [X] Istnieje aplikacja Node.js (jeden endpoint `/greet?name=Mac`)
- [X] Aplikacja spakowana jest w kontener

## Uruchomienie aplikacji w Cloud Run

- [ ] Zaprezentowanie [local testing Cloud Run](https://cloud.google.com/run/docs/testing/local#cloud-sdk)
- [ ] Buduje aplikacje za pomocą Cloud Build
- [ ] Aplikacja uruchamiana jest w Cloud Run z Conteiner Registry (`gcr.io`; środowisko Cloud Run; środowisko dev)

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