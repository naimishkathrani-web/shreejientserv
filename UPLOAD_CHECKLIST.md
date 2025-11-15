# Hostinger Upload Checklist for Email Fix

## Critical Files to Upload (Must Upload All)

### Step 1: Upload PHP Email Files
Upload these 3 files to `public_html/` folder:
- [ ] send-contact-email.php
- [ ] send-contract-email.php  
- [ ] send-new-rider-email.php

**Important:** After uploading, check file permissions:
- Right-click each PHP file in File Manager
- Set permissions to `644` (rw-r--r--)

### Step 2: Upload JavaScript Files  
Upload these 2 files to `public_html/` folder:
- [ ] contract-script.js
- [ ] new-rider-script.js

### Step 3: Upload HTML Pages
Upload these 2 files to `public_html/` folder:
- [ ] contract.html
- [ ] new-rider-contract.html

### Step 4: Upload Configuration
Upload this file to `public_html/` folder:
- [ ] .htaccess

## Testing After Upload

### Test 1: Check PHP Files Exist
Visit these URLs in your browser:
1. https://shreejientserv.in/send-contact-email.php
2. https://shreejientserv.in/send-contract-email.php
3. https://shreejientserv.in/send-new-rider-email.php

**Expected:** You should see a blank page or JSON error (NOT a 404)

### Test 2: Check Contract Pages Load
Visit these URLs:
1. https://shreejientserv.in/contract.html
2. https://shreejientserv.in/new-rider-contract.html

**Expected:** Pages should load with forms visible

### Test 3: Submit Forms
1. Fill out the **existing rider form** at https://shreejientserv.in/contract.html
2. Fill out the **new rider form** at https://shreejientserv.in/new-rider-contract.html

**Expected:** Success message should appear, emails should be sent

## Common Issues & Solutions

### Issue 1: "Failed to fetch" error
**Cause:** PHP files not uploaded or wrong location
**Solution:** 
- Re-upload all 3 PHP files to `public_html/` (NOT in a subfolder)
- Check file permissions are `644`
- Clear browser cache and try again

### Issue 2: PHP file shows code instead of running
**Cause:** PHP not configured correctly
**Solution:**
- In hPanel, go to Advanced → Select PHP Version
- Make sure PHP 7.4 or 8.0 is selected
- Click "Save"

### Issue 3: 500 Internal Server Error
**Cause:** .htaccess syntax error
**Solution:**
- Check .htaccess was uploaded correctly
- Try temporarily renaming .htaccess to .htaccess.bak
- If site works, there's an .htaccess issue

### Issue 4: Email not sending
**Cause:** Email accounts not created or mail() function disabled
**Solution:**
- Create email accounts: info@shreejientserv.in and hr@shreejientserv.in
- In hPanel → Email → Email Accounts → Create
- Test again after accounts are created

## File Structure on Hostinger

Your `public_html` folder should look like this:
```
public_html/
├── .htaccess
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
├── send-new-rider-email.php
└── Images/
    └── Shreeji Logo 1.jpg
```

## Need Help?

If you still get errors after uploading:
1. Check browser console (F12) for exact error message
2. Check PHP error logs in hPanel → Advanced → Error Log
3. Contact: info@shreejientserv.in or +91-7016899689
