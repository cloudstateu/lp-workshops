<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Read Replica

W tym laboratorium dowiesz się jak skonfigurować Read Replice

---

## Krok 1: Utwórz Read Replica w innej zone

```bash
gcloud sql instances create sql-instance-read-2 --master-instance-name=sql-instance --zone=europe-west3-c​
```

Poniżej przykład jak utworzyć Read Replica w innym regionie:

```bash
gcloud sql instances create sql-instance-read-3 --master-instance-name=sql-instance --region=europe-north1​
```

## Krok 2: Sprawdź w jaki sposób rozpoznać Read Replica

Porównaj obie instancje:

```bash
gcloud sql instances list --format="table(name,replicaNames,settings.databaseReplicationEnabled,masterInstanceName)"
```

Jeśli instancja jest Primary Instance to

   - `replicaNames` będzie przechowywało nazwy Read Replicas

Jeśli instancja jest Read Replica to:

   - `settings.databaseReplicationEnabled` będzie miało wartość `true`
   - `masterInstanceName` będzie miało wartość z nazwą Primary Instance

---

**Koniec laboratorium**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
