# AWS Provisioning Instructions
## Run This to Setup Infrastructure for Phase 1

**Status:** Ready to provision  
**Timeline:** 15-20 minutes (including 5-10 min RDS setup)

---

## How to Run the Provisioning Script

### Option 1: Run Directly on Your Machine (RECOMMENDED)

**Prerequisites:**
- AWS CLI installed (`pip install awscli`)
- Bash shell (Mac/Linux/WSL)

**Steps:**

1. **Download the script:**
   ```bash
   cp /home/devuser/.openclaw/workspace-dev/clients/MiglioreVita/aws-provision.sh ./
   ```

2. **Make it executable:**
   ```bash
   chmod +x aws-provision.sh
   ```

3. **Run it:**
   ```bash
   ./aws-provision.sh
   ```

4. **Wait for completion** (~15-20 minutes)
   - EC2 will be ready in ~2-3 minutes
   - RDS will take 5-10 minutes
   - S3 is instant

5. **Save the output:**
   - Script automatically creates: `migliore-vita-aws-credentials.txt`
   - This file contains all connection strings & credentials

---

### What the Script Creates

**1. Security Groups**
- API Security Group (allows 443 HTTPS, 22 SSH)
- RDS Security Group (allows PostgreSQL 5432 from API only)

**2. EC2 Instance** (t3.small)
- OS: Ubuntu 22.04 LTS
- Region: eu-south-1 (Milan, closest to Egypt)
- Public IP: Assigned automatically
- SSH access: With auto-generated key pair

**3. PostgreSQL 15 Database**
- Instance class: db.t3.micro
- Database name: migliore_vita
- Admin user: admin
- Auto-backups: 7 days
- Size: 20 GB SSD

**4. S3 Bucket**
- Name: migliore-vita-media-prod
- Public access: Blocked
- Versioning: Enabled
- Region: eu-south-1

---

## Expected Output (After Script Completes)

```
========================================
✓ AWS Infrastructure Provisioned Successfully!
========================================

EC2 INSTANCE:
Instance ID: i-0xxxxx...
Instance IP: 1.2.3.4
SSH Key: migliore-vita-key.pem
SSH Command: ssh -i migliore-vita-key.pem ubuntu@1.2.3.4

POSTGRESQL DATABASE:
Endpoint: migliore-vita-db.xxxxx.eu-south-1.rds.amazonaws.com
Port: 5432
Database: migliore_vita
Username: admin
Password: [auto-generated]
DATABASE_URL: postgresql://admin:PASSWORD@endpoint:5432/migliore_vita

S3 BUCKET:
Bucket Name: migliore-vita-media-prod
Region: eu-south-1

✓ Credentials saved to: migliore-vita-aws-credentials.txt
```

---

## After Script Completes

**1. Share these details with me (Adam):**
   - Instance IP
   - Database endpoint
   - Database password
   - S3 bucket name

**2. I will:**
   - Give these to Coding Agent
   - Coding Agent will deploy backend
   - Test connectivity

**3. You should:**
   - Save the `migliore-vita-key.pem` file (for SSH access)
   - Store credentials safely
   - Don't commit to GitHub

---

## Troubleshooting

**If script fails:**
1. Check AWS CLI is installed: `aws --version`
2. Check credentials are correct (you provided them)
3. Check region availability (eu-south-1 should work)
4. If key pair error: Script will auto-create

**If EC2 creation fails:**
- Usually recovers on retry
- Check security group permissions

**If RDS takes long:**
- Normal (can take 5-10 minutes)
- Don't interrupt
- Script waits automatically

---

## Security Notes

⚠️ **Important:**
1. Save the `migliore-vita-key.pem` file securely
2. Don't commit credentials to GitHub
3. RDS is NOT publicly accessible (safe)
4. S3 public access is blocked (safe)
5. SSH restricted to your IP recommended (future enhancement)

---

## Ready?

**Mohammed, please:**
1. Run the script on your machine
2. Wait for completion (~20 min)
3. Share the output with me (or the credentials.txt file)
4. I'll immediately configure Coding Agent

🚀 **Then Phase 1 accelerates!**
