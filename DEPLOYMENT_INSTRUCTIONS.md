# Deployment Instructions for Hostinger

## Quick Start (3 Steps)

### Step 1: Build the Site
Double-click `deploy.bat` in this folder. It will:
- Install dependencies
- Build the static site
- Copy the PHP email handler
- Create an `out` folder with everything ready

### Step 2: Upload to Hostinger
1. Log in to Hostinger
2. Go to **Files → File Manager** (or use FTP)
3. Navigate to `public_html`
4. **Delete all old files** in public_html
5. **Upload ALL files** from the `out` folder

### Step 3: Configure Email
1. Open `send-email.php` in the File Manager
2. Find this line:
   ```php
   $to = 'info@shreejientserv.in';
   ```
3. Change it to your actual email address
4. Save the file

## That's It!

Your website is now live at **www.shreejientserv.in**

## Testing
- Visit your website
- Go to the contract page
- Fill out and submit the form
- Check your email inbox

## Troubleshooting

**Forms not sending emails?**
- Check that `send-email.php` is uploaded
- Verify the email address in `send-email.php`
- Check Hostinger's spam folder
- Contact Hostinger support to ensure PHP mail() is enabled

**Pages not loading?**
- Make sure you uploaded ALL files from the `out` folder
- Check that files are in `public_html`, not a subfolder

## Future Updates

When you make changes:
1. Edit the code in `d:\Dev\ShreejiEntServ\src`
2. Run `deploy.bat` again
3. Re-upload the `out` folder to Hostinger

---

**Need help?** The deployment is now automated - just run `deploy.bat` and upload!
