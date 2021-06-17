<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Managing roles and permissions

## Assign roles using GCP Console

### Step 1: Grant access

1. Open the IAM page in the Cloud Console using link: `https://console.cloud.google.com/iam-admin/iam`
1. Click Select a project from top menu, choose a project, and click Open.
1. Click Add.
1. Enter an email address. You can add individuals, service accounts, or Google Groups as members, but every project must have at least one individual as a member.
1. Select a role. Roles give members the appropriate level of permission.
1. Click Save.

### Step 2: Revoke access

1. Open the IAM page in the Cloud Console using link: `https://console.cloud.google.com/iam-admin/iam`
1. Click Select a project.
1. Select a project and click Open.
1. Locate the member for whom you want to revoke access, and then click the Edit edit button on the right.
1. Click the Delete delete button for each role you want to revoke, and then click Save.

## Assign roles using `gcloud`

### Step 1: Grant access

1. Open Cloud shell or terminal.
1. Execute command to add access for user to project as viewer:

   ```bash
   gcloud projects add-iam-policy-binding [projectid] --member user:user@example.com --role roles/viewer
   ```

### Step 2: Revoke access

Revoke access using command:

```bash
gcloud projects remove-iam-policy-binding [projectid] --member user:user@example.com --role roles/viewer
```

### Step 3: Export policies

Export policies to json file using command:

```bash
gcloud projects get-iam-policy [projectid] --format json > ~/policy.json
```

---

**End of lab**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
