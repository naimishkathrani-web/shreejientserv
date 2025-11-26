# Complete Hostinger Deployment Guide for www.shreejientserv.in

## 📋 Pre-Deployment Checklist

### ✅ Files Ready for Upload:
1. **HTML Files** (4 files)
   - index.html
   - contract.html
   - new-rider-contract.html
   - delivery-partner.html

2. **CSS Files** (2 files)
   - styles.css
   - contract-styles.css

3. **JavaScript Files** (3 files)
   - script.js
   - contract-script.js
   - new-rider-script.js

4. **PHP Files** (3 active files)
   - send-contact-email.php (Contact form)
   - send-contract-email.php (Existing rider contracts)
   - send-new-rider-email.php (New rider - 2 emails)

5. **Images Folder**
   - Images/Shreeji Logo 1.jpg

### ✅ Email Configuration Verified:
- ✅ info@shreejientserv.in (sender, main contact)
- ✅ hr@shreejientserv.in (CC for contracts)
- ✅ All PHP files use native PHP mail() function (Hostinger compatible)

---

## 🎯 STEP-BY-STEP DEPLOYMENT PROCESS

### **STEP 1: Hostinger Account Setup & Email Configuration**

#### 1.1 Login to Hostinger
1. Go to https://hostinger.com
2. Login to your Hostinger account
3. Navigate to **hPanel** (Hostinger Control Panel)

#### 1.2 Verify Domain
1. In hPanel, go to **Domains** section
2. Confirm `shreejientserv.in` is active and pointing to your hosting

#### 1.3 Create Email Accounts (CRITICAL - Do this FIRST!)
1. In hPanel, go to **Email** → **Email Accounts**
2. Click **Create Email Account**
3. Create TWO email accounts:

   **Email Account 1:**
   - Email: `info@shreejientserv.in`
   - Password: [Create a strong password]
   - Storage: At least 1GB
   - Click **Create**

   **Email Account 2:**
   - Email: `hr@shreejientserv.in`
   - Password: [Create a strong password]
   - Storage: At least 1GB
   - Click **Create**

4. **Test Email Accounts:**
   - Go to **Webmail** (https://webmail.hostinger.com)
   - Login with both accounts to verify they work
   - Send a test email from info@ to hr@ to confirm delivery

---

### **STEP 2: Enable PHP Mail Function**

#### 2.1 Verify PHP Version
1. In hPanel, go to **Advanced** → **PHP Configuration**
2. Ensure PHP version is **8.0 or higher** (recommended: 8.1 or 8.2)
3. If needed, change PHP version for `shreejientserv.in`

#### 2.2 Configure PHP Mail Settings
1. Still in PHP Configuration, scroll to **PHP Options**
2. Verify these settings are enabled:
   - `sendmail_path` - should be set (default is fine)
   - No restrictions on `mail()` function
3. Click **Save** if you made changes

#### 2.3 Check Email Sending Limits
1. Go to **Email** → **Email Configuration**
2. Note the hourly sending limit (usually 100-500 emails/hour on Hostinger)
3. This is sufficient for your needs

---

### **STEP 3: Upload Files to Hostinger**

#### 3.1 Access File Manager
1. In hPanel, go to **Files** → **File Manager**
2. Navigate to `public_html` folder
3. **IMPORTANT:** If there are existing files (like index.html, .htaccess), decide:
   - Option A: Delete them if it's a fresh site
   - Option B: Backup them first (download to your computer)

#### 3.2 Upload Method 1: Using File Manager (Recommended for First Time)
1. Click **Upload Files** button
2. Upload files in this order:

   **First - Upload Images folder:**
   - Click "New Folder", name it `Images` (capital I)
   - Go inside Images folder
   - Upload: `Shreeji Logo 1.jpg`

   **Second - Upload HTML files:**
   - Go back to `public_html`
   - Upload all 4 HTML files:
     - index.html
     - contract.html
     - new-rider-contract.html
     - delivery-partner.html

   **Third - Upload CSS files:**
   - Upload both CSS files:
     - styles.css
     - contract-styles.css

   **Fourth - Upload JavaScript files:**
   - Upload all 3 JS files:
     - script.js
     - contract-script.js
     - new-rider-script.js

   **Fifth - Upload PHP files:**
   - Upload these 3 PHP files:
     - send-contact-email.php
     - send-contract-email.php
     - send-new-rider-email.php

#### 3.3 Verify File Structure
Your `public_html` folder should now look like:
```
public_html/
├── Images/
│   └── Shreeji Logo 1.jpg
├── index.html
├── contract.html
├── new-rider-contract.html
├── delivery-partner.html
├── styles.css
├── contract-styles.css
├── script.js
├── contract-script.js
├── new-rider-script.js
├── send-contact-email.php
├── send-contract-email.php
└── send-new-rider-email.php
```

---

### **STEP 4: Set Correct File Permissions**

#### 4.1 PHP Files Permissions
1. In File Manager, right-click each PHP file
2. Select **Permissions** or **Change Permissions**
3. Set to **644** or use checkboxes:
   - Owner: Read + Write
   - Group: Read
   - Public: Read
4. Apply to all 3 PHP files

#### 4.2 Verify Folder Permissions
1. Right-click `Images` folder
2. Permissions should be **755**:
   - Owner: Read + Write + Execute
   - Group: Read + Execute
   - Public: Read + Execute

---

### **STEP 5: Test Basic Website Access**

#### 5.1 Test Homepage
1. Open browser (preferably Incognito/Private mode)
2. Go to: `https://www.shreejientserv.in`
3. **Expected:** Homepage loads with logo, navigation, all sections visible
4. **Check:** Logo appears (if not, it's a path issue)

#### 5.2 Test All Pages
1. Test each page manually:
   - `https://www.shreejientserv.in/contract.html`
   - `https://www.shreejientserv.in/new-rider-contract.html`
   - `https://www.shreejientserv.in/delivery-partner.html`
2. **Expected:** All pages load, logo visible, content displays correctly

---

### **STEP 6: Test Email Functionality (CRITICAL)**

#### 6.1 Test Contact Form (send-contact-email.php)
1. Go to homepage: `https://www.shreejientserv.in`
2. Scroll to **Contact Us** section
3. Fill the form:
   - Name: Test User
   - Email: your-personal-email@gmail.com
   - Phone: 1234567890
   - Service: Delivery & Logistics Personnel
   - Message: This is a test message
4. Click **Send Message**
5. **Expected Results:**
   - Success message appears
   - Check `info@shreejientserv.in` inbox (via Webmail)
   - You should receive the contact form email
   - Check your personal email for confirmation (if implemented)

**If email doesn't work:**
- Check File Manager → PHP files have correct permissions (644)
- Check hPanel → Email Accounts → Both accounts are active
- Check hPanel → Email Logs for any errors
- Try sending test email via Webmail first

#### 6.2 Test Existing Rider Contract (send-contract-email.php)
1. Go to: `https://www.shreejientserv.in/contract.html`
2. Select language: English
3. **Scroll through all terms** to the bottom
4. Check the checkbox: "I have read and understood..."
5. Form appears - fill ALL fields:
   - First Name: Test
   - Last Name: Rider
   - Father/Mother Name: Parent Name
   - Parent Mobile: 9876543210
   - Email: your-test-email@gmail.com
   - Date of Birth: 01/01/2000
   - Aadhar: 123456789012
   - PAN: ABCDE1234F
   - Mobile: 9876543210
   - Permanent Address: Test Address
   - Current Address: Test Address
   - Work Location: Rajkot
   - Signed Location: Rajkot
   - Vehicle Type: Motorcycle
   - Vehicle Number: GJ01AB1234
   - License Number: GJ0120230001234
   - Check "I agree" checkbox
6. Click **Submit Agreement**
7. **Expected Results:**
   - Success message appears
   - Check `your-test-email@gmail.com` - should receive 1 email with:
     - Subject: "Contract Accepted - Freelance Rider Agreement"
     - All contract terms
     - Legal declaration "I [Name] hereby agree..."
   - Check `info@shreejientserv.in` - should receive CC copy
   - Check `hr@shreejientserv.in` - should receive HR copy

#### 6.3 Test New Rider Application (send-new-rider-email.php)
1. Go to: `https://www.shreejientserv.in/new-rider-contract.html`
2. Select language: English
3. **Scroll through all terms** to the bottom
4. Check the checkbox
5. Fill form (same as above)
6. Click **Submit Application**
7. **Expected Results:**
   - Success message appears
   - Check `your-test-email@gmail.com` - should receive 2 emails:
     
     **Email 1:** (sent first)
     - Subject: "Contract Accepted - New Rider Application"
     - Legal declaration
     - All 17 contract terms
     
     **Email 2:** (sent 2 seconds later)
     - Subject: "Activation In Progress - Welcome to Shreeji"
     - 4-step activation timeline
     - Welcome message
   
   - Check `info@shreejientserv.in` - should receive CC copies
   - Check `hr@shreejientserv.in` - should receive HR notification

---

### **STEP 7: Troubleshooting Common Issues**

#### Issue 1: Emails Not Sending
**Symptoms:** Form submits but no emails received

**Solutions:**
1. **Check Email Accounts:**
   ```
   hPanel → Email → Email Accounts
   - Verify both accounts exist and are active
   - Try logging into Webmail with each account
   ```

2. **Check PHP Error Logs:**
   ```
   hPanel → Files → File Manager → public_html
   - Look for "error_log" file
   - Right-click → View → Check for PHP errors
   ```

3. **Check Email Logs:**
   ```
   hPanel → Email → Email Logs
   - Look for recent sending attempts
   - Check for "failed" or "bounced" messages
   ```

4. **Test mail() Function Directly:**
   Create a test file `test-email.php` in public_html:
   ```php
   <?php
   $to = "your-email@gmail.com";
   $subject = "Test Email from Hostinger";
   $message = "If you receive this, PHP mail() is working!";
   $headers = "From: info@shreejientserv.in";
   
   if (mail($to, $subject, $message, $headers)) {
       echo "Email sent successfully!";
   } else {
       echo "Email failed to send.";
   }
   ?>
   ```
   Access: `https://www.shreejientserv.in/test-email.php`

5. **Verify SPF/DKIM Records:**
   ```
   hPanel → Email → Email Deliverability
   - Ensure all checks are green
   - If not, follow Hostinger's setup instructions
   ```

#### Issue 2: Logo Not Displaying
**Symptoms:** Logo broken or missing

**Solutions:**
1. **Check Image Path:**
   - In File Manager, verify: `public_html/Images/Shreeji Logo 1.jpg` exists
   - Case-sensitive: Must be capital "I" in Images

2. **Check File Permissions:**
   - Images folder: 755
   - Logo file: 644

3. **Test Direct Access:**
   - Open: `https://www.shreejientserv.in/Images/Shreeji%20Logo%201.jpg`
   - Should display the logo image

#### Issue 3: Forms Not Submitting
**Symptoms:** Form submits but shows error

**Solutions:**
1. **Check PHP File Permissions:** Must be 644
2. **Check CORS Headers:** Already included in PHP files
3. **Check Browser Console:**
   - Press F12
   - Go to Console tab
   - Look for JavaScript errors
4. **Verify PHP Version:** Must be 7.4+ (8.x recommended)

#### Issue 4: Page Loads But Looks Broken
**Symptoms:** Missing styles or layout issues

**Solutions:**
1. **Check CSS Files Uploaded:** Both styles.css and contract-styles.css
2. **Clear Browser Cache:** Ctrl+F5 or Cmd+Shift+R
3. **Check File Paths:** All CSS/JS files should be in public_html root

---

### **STEP 8: SSL Certificate (HTTPS)**

#### 8.1 Enable Free SSL
1. In hPanel, go to **Security** → **SSL**
2. Find `shreejientserv.in`
3. Click **Install** for free SSL
4. Wait 10-20 minutes for activation

#### 8.2 Force HTTPS Redirect
1. In File Manager, go to `public_html`
2. Check if `.htaccess` file exists
3. If not, create it (click "New File", name: `.htaccess`)
4. Add this code:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force www
RewriteCond %{HTTP_HOST} !^www\.
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

### **STEP 9: Performance Optimization**

#### 9.1 Enable PHP OPcache
1. Go to **Advanced** → **PHP Configuration**
2. Find **PHP Extensions**
3. Enable: `opcache`
4. Click **Save**

#### 9.2 Enable Gzip Compression
Add to `.htaccess`:
```apache
# Enable Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

### **STEP 10: Final Production Checklist**

#### ✅ Pre-Launch Checklist:
- [ ] All 13 files uploaded to public_html
- [ ] Images folder created with logo inside
- [ ] File permissions set correctly (PHP: 644, Folders: 755)
- [ ] Both email accounts created and tested
- [ ] Homepage loads at www.shreejientserv.in
- [ ] All 4 pages load correctly
- [ ] Logo displays on all pages
- [ ] Navigation works on all pages
- [ ] Contact form sends email successfully
- [ ] Existing rider contract sends 1 email to rider + CC to info + CC to hr
- [ ] New rider contract sends 2 emails to rider + CC to both accounts
- [ ] SSL certificate installed and active
- [ ] HTTPS redirect working
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

#### ✅ Post-Launch Monitoring:
- [ ] Check email deliverability daily for first week
- [ ] Monitor `error_log` file for PHP errors
- [ ] Test form submissions weekly
- [ ] Keep backup of all files locally
- [ ] Monitor website loading speed
- [ ] Check email inbox regularly (info@ and hr@)

---

### **STEP 11: Backup Strategy**

#### 11.1 Setup Automatic Backups (if available in your plan)
1. Go to **Backups** section in hPanel
2. Enable automatic daily backups
3. Set retention period (usually 7-30 days)

#### 11.2 Manual Backup Before Major Changes
1. File Manager → Select all files
2. Click **Download** or **Compress**
3. Save to your computer
4. Date the backup file

---

## 🎊 Deployment Complete!

### Post-Deployment URLs:
- **Homepage:** https://www.shreejientserv.in
- **Existing Rider Contract:** https://www.shreejientserv.in/contract.html
- **New Rider Application:** https://www.shreejientserv.in/new-rider-contract.html
- **Delivery Partner Info:** https://www.shreejientserv.in/delivery-partner.html

### Email Configuration:
- **Primary Contact:** info@shreejientserv.in
- **HR Department:** hr@shreejientserv.in
- **Webmail Access:** https://webmail.hostinger.com

### Support Contacts:
- **Hostinger Support:** 24/7 Live Chat in hPanel
- **Email Issues:** Check hPanel → Email Logs
- **Technical Issues:** Check hPanel → Support → Knowledge Base

---

## 📱 Testing Checklist (Use This After Deployment)

### Desktop Testing:
- [ ] Homepage loads with all sections
- [ ] Navigation menu works
- [ ] Contact form submission works
- [ ] Existing rider contract form works
- [ ] New rider contract form works
- [ ] All images display correctly
- [ ] All links work
- [ ] Forms show success messages
- [ ] Emails received in inbox

### Mobile Testing:
- [ ] Homepage responsive on mobile
- [ ] Hamburger menu works
- [ ] Forms are mobile-friendly
- [ ] Images scale properly
- [ ] Buttons are touch-friendly
- [ ] Checkbox visible and clickable
- [ ] Form submission works on mobile

### Email Testing:
- [ ] Contact form email received
- [ ] Existing rider email received (1 email)
- [ ] New rider emails received (2 emails)
- [ ] Email formatting looks good
- [ ] All data displays correctly
- [ ] HR receives CC copies
- [ ] Reply-To works correctly

---

## 🆘 Emergency Contacts & Resources

### Hostinger Support:
- **Live Chat:** Available 24/7 in hPanel
- **Knowledge Base:** https://support.hostinger.com
- **Video Tutorials:** https://www.youtube.com/hostinger

### Common Hostinger Issues:
1. **Email not sending:** Usually due to SPF/DKIM not configured
2. **Website not loading:** Check DNS propagation (can take 24-48 hours)
3. **PHP errors:** Check PHP version and error logs
4. **Permission issues:** Reset to 644 for files, 755 for folders

---

## 📝 Notes:

1. **DNS Propagation:** If you just set up the domain, DNS changes can take 24-48 hours to propagate worldwide. Use https://dnschecker.org to check status.

2. **Email Deliverability:** First emails might go to spam. Ask recipients to mark as "Not Spam" to improve deliverability.

3. **File Updates:** To update files, simply re-upload them via File Manager. They'll overwrite existing files.

4. **Database:** This website doesn't use a database currently. All data is sent via email. If you want to store submissions in the future, you'll need to add MySQL database integration.

5. **Backups:** Download all files locally before making major changes. Hostinger provides automatic backups but manual backups are recommended.

---

## ✅ Quick Reference Commands

### File Permissions:
- **PHP Files:** 644 (rw-r--r--)
- **HTML/CSS/JS:** 644 (rw-r--r--)
- **Folders:** 755 (rwxr-xr-x)
- **Images:** 644 (rw-r--r--)

### Important Paths:
- **Website Root:** public_html/
- **Images:** public_html/Images/
- **Logs:** public_html/error_log
- **Config:** public_html/.htaccess

### Email Settings:
- **SMTP:** Not needed (using PHP mail())
- **From Address:** info@shreejientserv.in
- **HR CC:** hr@shreejientserv.in
- **Rate Limit:** 100-500/hour (check your plan)

---

**Good Luck with Your Deployment! 🚀**

If you encounter any issues not covered in this guide, reach out to Hostinger support through the live chat in hPanel. They're very helpful!
