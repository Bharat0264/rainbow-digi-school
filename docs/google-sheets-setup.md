# Rainbow Digi School — Google Sheets & Email Admissions Integration

This guide provides step-by-step instructions for deploying, configuring, and maintaining the Google Sheets and email admissions enquiry pipeline for Rainbow Digi School.

---

## 1. Architectural Overview

```
[Parent / Visitor Browser]
         |
         | POST /api/enquiries (JSON)
         v
[Vercel Serverless Function: api/enquiries.ts]
   - Validates origin (ALLOWED_ORIGINS)
   - Enforces rate/payload limits (<12KB)
   - Validates input schema with Zod
   - Generates unique reference: RDS-ENQ-YYYY-XXXXXXXXXX
   - Forwards with shared secret to Google Apps Script
         |
         | POST HTTPS (redirect: follow)
         v
[Google Apps Script Web App: integrations/google-sheets/Code.gs]
   - Validates shared secret (constant-time comparison)
   - Acquires LockService concurrency lock (up to 20s)
   - Sanitizes against formula injection (=, +, -, @, \t, \r, %)
   - Checks reference idempotency (prevents duplicates)
   - Appends row to Google Sheet (Status: "NEW")
   - Dispatches HTML & plain text notification email to admissions desk
         |
         +----------------------------+
         |                            |
         v                            v
[Google Sheet Storage]      [Admissions Office Inbox]
(Secure, searchable,        (Instant alert with enquiry
 team-accessible)            details and click-to-call)
```

- **API Contract:** Remains identical: `POST /api/enquiries` returns `{ "enquiryNumber": "RDS-ENQ-2026-XXXXXXXXXX" }` with HTTP status `201 Created`.
- **Database Dependency:** PostgreSQL and Prisma have been completely removed. Zero server database hosting costs or database connection pool management required.

---

## 2. Google Spreadsheet Setup

### Step 2.1: Create the Google Sheet
1. Log into your school Google account (e.g. `rainbowdigischool01@gmail.com`).
2. Visit [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
3. Name the spreadsheet:
   ```text
   Rainbow Digi School — Admissions Enquiries
   ```
4. Rename the default sheet tab (at the bottom) to:
   ```text
   Enquiries
   ```

### Step 2.2: Add Column Headers
In Row 1, add the following headers across columns **A** to **H**:

| Column | Header Name | Data Type / Example | Description |
| :---: | :--- | :--- | :--- |
| **A** | `Reference` | `RDS-ENQ-2026-A1B2C3D4E5` | Unique enquiry tracking number |
| **B** | `Submitted At` | `2026-10-12 14:30:00 IST` | Submission timestamp in IST |
| **C** | `Parent Name` | `Priya Sharma` | Full name of parent/guardian |
| **D** | `Mobile` | `9876543210` | 10-digit Indian contact number |
| **E** | `Email` | `parent@example.com` | Optional email address |
| **F** | `Class` | `Grade 1` | Nursery, LKG, UKG, or Grade 1–5 |
| **G** | `Message` | `Enquiry about school transport` | Optional parent note |
| **H** | `Status` | `NEW` | Pipeline status (`NEW`, `CONTACTED`, etc.) |

### Step 2.3: Recommended Formatting
1. Select Row 1, make it **Bold**, and set background color to a light pastel (e.g. soft amber/yellow `#FEF3C7`).
2. Click **View > Freeze > 1 row** so headers remain visible when scrolling.
3. Select Column D (Mobile), click **Format > Number > Plain text** to prevent leading zeros from being dropped.
4. Set column widths appropriately (Reference: 220px, Submitted At: 180px, Parent Name: 160px, Mobile: 130px, Email: 200px, Class: 100px, Message: 300px, Status: 120px).

---

## 3. Google Apps Script Setup & Deployment

### Step 3.1: Open Apps Script Editor
1. In your Google Sheet, click **Extensions > Apps Script** from the top menu.
2. Rename the project from "Untitled project" to:
   ```text
   Rainbow Digi School — Enquiry Webhook
   ```

### Step 3.2: Paste the Integration Code
1. In the Apps Script code editor, delete any starter code in `Code.gs`.
2. Copy the entire contents of [`integrations/google-sheets/Code.gs`](../integrations/google-sheets/Code.gs) and paste it into `Code.gs`.
3. Click the disk icon (**Save project** or `Ctrl+S`).

### Step 3.3: Configure Script Properties (Secrets & Settings)
Script Properties securely store configuration without hardcoding secrets in code:
1. In the Apps Script editor, click the gear icon (**Project Settings**) on the left sidebar.
2. Scroll down to **Script Properties** and click **Add script property**.
3. Add the following properties:

| Property Name | Value | Required | Description |
| :--- | :--- | :---: | :--- |
| `SHARED_SECRET` | *(Generate a strong random 32+ character key)* | **Yes** | Shared secret between Vercel and Apps Script |
| `NOTIFICATION_EMAIL` | `rainbowdigischool01@gmail.com` | **Yes** | School admissions inbox where email alerts are sent |
| `SHEET_ID` | *(Leave empty if script is opened from the sheet)* | No | Only required if using a standalone script |

> [!TIP]
> You can generate a secure shared secret using PowerShell or Node.js:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Step 3.4: Test the Script Configuration
1. Return to the **Editor** (`< >` icon) in Apps Script.
2. Select `testSetup` from the function dropdown at the top toolbar and click **Run**.
3. When prompted, click **Review permissions**, choose your Google account, click **Advanced**, and select **Go to Rainbow Digi School — Enquiry Webhook (unsafe)**, then click **Allow**.
4. Check the **Execution log** at the bottom: it should report that `SHARED_SECRET`, `NOTIFICATION_EMAIL`, and Spreadsheet access are all configured and verified.

### Step 3.5: Deploy as a Web App
1. Click the blue **Deploy** button at top right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description:** `Rainbow Digi School Admissions Webhook v1`
   - **Execute as:** `Me (<your-email>@gmail.com)` *(ensures the script runs with permissions to edit your sheet and send emails)*
   - **Who has access:** `Anyone` *(allows Vercel serverless function to invoke the webhook)*
4. Click **Deploy**.
5. Copy the generated **Web app URL**. It will look like:
   ```text
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
   *(Ensure it ends in `/exec`, not `/dev`)*

---

## 4. Vercel Environment Configuration

In your Vercel Dashboard for the Rainbow Digi School project:

1. Navigate to **Project Settings > Environment Variables**.
2. Add the following variables for **Production**, **Preview**, and **Development**:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `GOOGLE_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/AKfycb.../exec` | Full Web App deployment URL from Step 3.5 |
| `GOOGLE_APPS_SCRIPT_SECRET` | *(Same string as SHARED_SECRET in Step 3.3)* | Pre-shared authentication secret |
| `ALLOWED_ORIGINS` | `https://rainbow-digi-school.vercel.app,http://localhost:5173` | Comma-separated allowed frontend origins |

3. Trigger a redeployment in Vercel so the environment variables take effect.

---

## 5. Security & Reliability Highlights

- **Shared Secret Authentication:** All requests require the shared secret header or payload field. Apps Script validates it using constant-time string comparison to prevent timing attacks.
- **Formula Injection Defense:** Input fields starting with `=`, `+`, `-`, `@`, `\t`, `\r`, or `%` are automatically prefixed with a single quote `'` in Google Sheets to neutralize spreadsheet command injection.
- **Concurrency Locks:** Uses `LockService.getScriptLock().tryLock(20000)` to ensure concurrent form submissions never overwrite rows or interleave spreadsheet writes.
- **Idempotency Protection:** The webhook inspects Column A (`Reference`). If an identical reference is resent, it acknowledges success without duplicating the row or sending a second email.
- **Resilient Email Dispatch:** Email sending is wrapped in a dedicated `try/catch`. If daily Google email quotas (100/day for consumer Gmail, 1,500/day for Google Workspace) are exceeded, the enquiry remains safely recorded in Google Sheets and returns `201 Created` to the user.
- **Zero PII Logging:** Parent phone numbers, names, and secrets are never output to Google Cloud or Vercel server execution logs.

---

## 6. Secret Rotation Procedure

If the shared secret needs to be rotated:
1. Generate a new 32+ character random secret string.
2. In Google Apps Script: Go to **Project Settings > Script Properties** and update `SHARED_SECRET`.
3. In Vercel: Go to **Project Settings > Environment Variables** and update `GOOGLE_APPS_SCRIPT_SECRET`.
4. Redeploy the Vercel project to load the new environment variable.
5. Submit a test enquiry to verify end-to-end connectivity.

---

## 7. Historical PostgreSQL Data Reference & Archival

The legacy PostgreSQL database used Prisma with the following schema before migration. If historical submissions from PostgreSQL need to be imported into the new Google Sheet, use the following mapping:

### Legacy PostgreSQL Table Definition
```sql
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enquiryNumber" TEXT NOT NULL UNIQUE,
    "parentName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "childName" TEXT NOT NULL,
    "childDateOfBirth" TIMESTAMP(3),
    "interestedProgram" TEXT NOT NULL,
    "currentSchool" TEXT,
    "locality" TEXT,
    "preferredCallback" TEXT,
    "preferredVisitDate" TIMESTAMP(3),
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEBSITE',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### PostgreSQL to Google Sheet Column Mapping
To migrate historical data, export rows with:
```sql
SELECT 
    "enquiryNumber" AS "Reference",
    TO_CHAR("createdAt" AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD HH24:MI:SS') || ' IST' AS "Submitted At",
    "parentName" AS "Parent Name",
    "mobile" AS "Mobile",
    COALESCE("email", '') AS "Email",
    "interestedProgram" AS "Class",
    COALESCE("message", '') AS "Message",
    "status" AS "Status"
FROM "Enquiry"
ORDER BY "createdAt" ASC;
```
Paste or import the resulting CSV rows directly below the header row in the Google Sheet.
