<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Service Accounts

## Creating Service Account using GCP Console

### Step 1: Creating service account

1. Open in left Menu IAM & Admin and open Service Accounts.
1. Click Create Service Account.
1. Enter a service account name (friendly display name), an optional description, select a role you wish to grant to the service account, and then click Save.

### Step 2: Creating keys

1. Look for the service account for which you wish to create a key, click the More button in that row, and then click Create key.
1. Select a Key type and click Create.

## Creating Service Account using `gcloud`

### Step 1: Creating service account

1. Open CLI console.
1. Type command:

   ```bash
   gcloud iam service-accounts create [SA-NAME] --description "[SA-DESCRIPTION]" --display-name "[SA-DISPLAY-NAME]"
   ```

1. Execute the command
1. List service accounts:

   ```bash
   gcloud iam service-accounts list
   ```

### Step 2: Creating keys

1. Execute command:

   ```bash
   gcloud iam service-accounts keys create ~/key.json --iam-account [SA-NAME]@[PROJECT-ID].iam.gserviceaccount.com
   ```

---

**End of lab**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
