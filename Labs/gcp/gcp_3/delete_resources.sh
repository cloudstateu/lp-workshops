# Forwarding rules
gcloud compute forwarding-rules delete fortressnet-http-rule --global -q
gcloud compute forwarding-rules delete fortressnet-http-ipv6-rule --global -q

# Backend Service
gcloud compute target-http-proxies delete fortressnet-http-proxy -q
gcloud compute url-maps delete fortressnet-balancer -q
gcloud compute backend-services delete fortressnet-backend-service --global -q

# Instance Groups
gcloud compute instance-groups managed delete europe-west1-pool --region europe-west1 -q
gcloud compute instance-groups managed delete us-central1-pool --region us-central1 -q
gcloud compute instance-groups managed delete asia-east1-pool --region asia-east1 -q

# Instance Template
gcloud compute instance-templates delete fort-template -q

# Network
gcloud compute firewall-rules delete fortressnet-allow-load-balancer -q
gcloud compute firewall-rules delete fortressnet-allow-http -q
gcloud compute networks delete fortressnet -q

gcloud compute addresses delete fortressnet-ip --global -q
gcloud compute addresses delete fortressnet-ipv6 --global -q
