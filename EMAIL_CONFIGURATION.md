# Email Configuration Guide

## Problem: Emails Not Sending

The website forms are not sending emails because PHP's `mail()` function requires SMTP configuration on Hostinger.

## Solution: Configure SMTP Password

### Step 1: Find Your Email Password
1. Log in to **Hostinger hPanel**
2. Go to **Emails → Email Accounts**
3. Find `info@shreejientserv.in`
4. Click **Manage** or **Change Password**
5. Copy the password (or create a new one)

### Step 2: Update SMTP Configuration
1. In Hostinger File Manager, open `public_html/smtp-mailer.php`
2. Find this line (around line 7):
   ```php
   private $smtp_pass = ''; // YOU MUST SET THIS
   ```
3. Replace it with:
   ```php
   private $smtp_pass = 'YOUR_EMAIL_PASSWORD_HERE';
   ```
4. Save the file

### Step 3: Test Email
1. Visit: `https://www.shreejientserv.in/test-email.php`
2. Check if it says "✓ mail() function returned TRUE"
3. Check your inbox at `info@shreejientserv.in`

---

## Alternative: Use Hostinger's SMTP Settings

If the above doesn't work, you can also configure SMTP in hPanel:

1. Go to **hPanel → Emails → Email Accounts**
2. Click on `info@shreejientserv.in`
3. Note the SMTP settings:
   - **Server**: smtp.hostinger.com
   - **Port**: 465 (SSL) or 587 (TLS)
   - **Username**: info@shreejientserv.in
   - **Password**: Your email password

These settings are already in `smtp-mailer.php`, you just need to add the password.

---

## Files Updated:
- `smtp-mailer.php` - SMTP email class
- `send-email.php` - Contract form handler (uses SMTP)
- `send-contact.php` - Contact form handler (uses SMTP)
- `test-email.php` - Email testing script

---

## After Configuration:
All forms will work:
- ✅ Contact form
- ✅ New rider application
- ✅ Existing rider contract

Emails will be sent from: `info@shreejientserv.in`
Emails will be received at: `info@shreejientserv.in`
