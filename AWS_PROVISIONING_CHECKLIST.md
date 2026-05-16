# AWS Infrastructure Provisioning Checklist
## Awaiting Mohammed's Credentials

**Status:** 🟡 READY TO PROVISION (Waiting for AWS credentials from Mohammed)  
**Timeline:** Will provision immediately upon receiving credentials  
**Target:** Have infrastructure live by May 12 morning

---

## AWS Resources to Provision

### 1. **EC2 Instance** (Application Server)
```
Instance Type: t3.small
vCPU: 1
Memory: 1 GB
Disk: 20 GB SSD
Region: (TBD - specify)
OS: Ubuntu 22.04 LTS
Security Group: 
  - Inbound: 443 (HTTPS), 22 (SSH - restricted to office IP)
  - Outbound: All
Elastic IP: (Reserve for stability)
```

**Purpose:** Runs Node.js Express API, PostgreSQL database

### 2. **RDS PostgreSQL** (Database)
```
Engine: PostgreSQL 15.x
Instance Class: db.t3.micro (can upgrade to small if needed)
Storage: 20 GB SSD
Multi-AZ: No (for cost savings)
Public Accessibility: No (only from EC2)
Backup: Daily automated (7-day retention)
Database Name: migliore_vita
Admin User: admin
```

**Purpose:** Centralized database for invoices, trips, media metadata

### 3. **S3 Bucket** (Media Storage)
```
Bucket Name: migliore-vita-media-prod
Region: (TBD)
Versioning: Disabled (immutable uploads)
Lifecycle Policy:
  - Standard (0-30 days)
  - Intelligent-Tiering (30-90 days)
  - Glacier (90+ days)
Encryption: AES-256 at rest
Public Access: Blocked (no public read)
CORS: Enable for Google Drive integration
```

**Purpose:** Archive photos/videos, backup media files

### 4. **IAM User** (API Credentials)
```
User: migliore-vita-api
Policies:
  - S3: GetObject, PutObject, DeleteObject (migliore-vita-media-*)
  - EC2: DescribeInstances (monitoring)
  - CloudWatch: PutMetricData (logging)
Access Keys: Generate 1 set
```

**Purpose:** API credentials for backend to upload to S3

### 5. **Security Groups** (Networking)
```
API Security Group:
  - Inbound: 443 from 0.0.0.0 (HTTPS)
  - Inbound: 22 from [Office IP] (SSH)
  - Outbound: All
  
RDS Security Group:
  - Inbound: 5432 from API Security Group only
  - Outbound: All
```

**Purpose:** Lock down database access, allow external API traffic only

### 6. **CloudWatch** (Monitoring)
```
Alarms:
  - EC2 CPU > 80% → Alert
  - RDS CPU > 80% → Alert
  - EC2 disk space > 80% → Alert
Logs: Enable for API errors
Dashboard: 1 main dashboard showing all metrics
```

**Purpose:** Early warning system for infrastructure issues

---

## What I (Adam) Will Do With Your Credentials

**Once you provide AWS Account credentials:**

1. ✅ Create all 6 resources above
2. ✅ Configure security groups (restrict DB access)
3. ✅ Setup automatic backups
4. ✅ Generate API credentials for backend
5. ✅ Create CloudWatch alarms
6. ✅ Document all connection strings
7. ✅ Test connectivity (EC2 ↔ RDS ↔ S3)
8. ✅ Provide Coding Agent with:
   - PostgreSQL connection string
   - S3 bucket name
   - IAM credentials
   - Security group details

---

## Credentials Needed From Mohammed

**Please provide:**

1. **AWS Account Details**
   - AWS Account ID
   - Access Key ID
   - Secret Access Key
   - Preferred Region (e.g., eu-south-1, us-east-1)

2. **Configuration Preferences**
   - EC2 region preference
   - Database region preference
   - Any IP restrictions (office IP for SSH)
   - Budget constraints (if any)

3. **Domain/DNS Info**
   - Domain name (api.aten.eg?)
   - SSL certificate preference (LetsEncrypt = free)

---

## Timeline

| Step | Time | Status |
|---|---|---|
| Mohammed provides credentials | Now | ⏳ Waiting |
| I provision AWS resources | 30 min after creds | 🔴 Blocked |
| Test connectivity | 10 min | 🔴 Blocked |
| Provide details to Coding Agent | 5 min | 🔴 Blocked |
| Coding Agent connects backend to DB | 1 hour | 🔴 Blocked |
| E2E test (offline → sync → DB) | 2 hours | 🔴 Blocked |

**Target: All infrastructure live by May 12 morning**

---

## Current Blockers

- ⏳ **Waiting for:** AWS credentials from Mohammed
- ⏳ **Coding Agent:** Can push code to GitHub now (doesn't need AWS yet)
- ⏳ **Infrastructure:** Ready to provision (30 min after credentials arrive)

---

## Ready to Go!

**Mohammed:** Send AWS credentials when ready  
**I (Adam):** Will provision infrastructure immediately  
**Coding Agent:** Pushing code to GitHub now

🚀 **Let's accelerate Phase 1!**
