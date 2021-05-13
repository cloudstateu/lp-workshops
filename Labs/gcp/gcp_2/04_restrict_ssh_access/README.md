<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200"  align="right">
<br><br>
<br><br>
<br><br>

# VPC Bastion Host

## LAB Overview

In this lab, you restric access to your machine via SSH to work only through GCP portal.

---

1. Create a new network allowing SSH traffic (`TCP/22`) for everyone (`0.0.0.0/0`).
1. Create a new VM connected to your fresh network
1. Verify you can SSH into VM via the portal.
1. Check SSH connection details. Check if the IP address is part of the range `35.235.240.0/20`.

   ```bash
   env | grep SSH_CONNECTION
   ```

1. Verify you can SSH into it via your local machine

   ```bash
   gcloud compute ssh --project=<YOUR-PROJECT-NAME> --zone=<VM-ZONE> <VM NAME>
   ```

1. Check SSH connection details. It should differ from the SSH connection made via the portal

   ```bash
   env | grep SSH_CONNECTION
   ```

1. Modify your network. Restrict access to SSH only for IP addresses that belong to the `35.235.240.0/20` range.
1. Check if you can SSH into VM via the portal.
1. Check if you can SSH into VM from your local machine.

## END LAB

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
