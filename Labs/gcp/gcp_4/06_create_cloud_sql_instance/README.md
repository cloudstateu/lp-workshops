<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Creating Cloud SQL instance

## LAB Overview

In this lab you'll create a new Cloud SQL instance with a sample table and data.

---

## Step 1: Create new Cloud SQL instance

1. Create new Cloud SQL instance (provisioning should take 2-3 minutes)

   ```bash
   gcloud sql instances create sql-instance --database-version=POSTGRES_13 --cpu=1 --memory=3840MiB --zone=europe-west3-a --root-password=password123
   ```

1. Verify that you're able to log into the instance:

   ```bash
   gcloud sql connect sql-instance --user=postgres
   ```

   (user password is `password123`)

1. List current databases: `\l`
1. Create new database `CREATE DATABASE lp_test;`
1. Connect to `lp_test` database: `\c lp_test`
1. Create new table _People_:

   ```sql
   CREATE TABLE people (
      pid SERIAL PRIMARY KEY,
      firstName varchar(255),
      lastName varchar(255)
   );
   ```

1. Insert sample row to _People_ table:

   ```sql
   INSERT INTO people (firstName, lastName) VALUES ('Joe', 'Doe'), ('Jane', 'Dee');
   ```

1. Verify table contents (it should contain two entries):

   ```sql
   SELECT * FROM people;
   ```

1. Logout from database using `\q`

## END LAB

<br>
<br>
<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
