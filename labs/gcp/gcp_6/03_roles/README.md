<img src="../../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# Roles and Custom Roles

## Create a custom role

1. From left menu click IAM & admin and then Roles

### Create a custom role from scratch

1. Click Create Role.
1. Enter a Name, a Title, and Description for the role.
1. Click Add Permissions.
1. Select the permissions you want to include in the role and click Add Permissions. Use the All Services and All Types drop-downs to filter and select permissions by services and types.

### Create custome role from existing role

1. Select the roles on which you want to base the new custom role.
1. Click Create Role from Selection.
1. Enter a Name, a Title, and Description for the role.
1. Uncheck the permissions you want to exclude from the role.
1. Click Add Permissions to include any permissions.
1. Click Create.

### Create custome role from CLI based on YAML file

1. Create role.yml:

   ```yaml
   title: "Role Viewer"
   description: "My custom role description."
   stage: "ALPHA"
   includedPermissions:
   - iam.roles.get
   - iam.roles.list
   ```

1. Enter command:

   ```bash
   gcloud iam roles create [role-id] --project my-project-id --file my-role-definition.yaml
   ```

1. Show all roles using command:

   ```bash
   gcloud iam roles list
   ```

1. Describe our new role using command:

   ```bash
   gcloud iam roles describe [role-id] --project [my-project-id]
   ```

---

**End of lab**

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
