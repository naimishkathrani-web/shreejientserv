# Hostinger Email Integration Setup

## Overview
This document provides step-by-step instructions to enable email functionality for the Rider Contract form on Hostinger hosting.

## Prerequisites
- Hostinger hosting account
- Domain: www.shreejientserv.in
- Email accounts created:
  - info@shreejientserv.in (sender)
  - hr@shreejientserv.in (HR recipient)

## Step 1: Create Email Accounts in Hostinger

1. Log in to your Hostinger control panel (hPanel)
2. Go to **Emails** section
3. Click **Create Email Account**
4. Create two email accounts:
   - **Email:** info@shreejientserv.in
   - **Email:** hr@shreejientserv.in
5. Set strong passwords for both accounts
6. Verify accounts by sending test emails

## Step 2: Upload PHP Email Handler

1. Connect to your hosting via **File Manager** or FTP
2. Navigate to `public_html` directory
3. Upload the file `send-contract-email.php` to the root of `public_html`
4. Set file permissions to **644** (read/write for owner, read for others)

## Step 3: Update JavaScript to Call PHP Backend

In `contract-script.js`, update the form submission handler to send data to PHP:

### Replace the localStorage section with AJAX call:

```javascript
// OLD CODE (lines ~905-910):
const existingData = JSON.parse(localStorage.getItem('riderContracts') || '[]');
existingData.push(formData);
localStorage.setItem('riderContracts', JSON.stringify(existingData));

// NEW CODE - Send to PHP backend:
fetch('https://www.shreejientserv.in/send-contract-email.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        // Show success message
        document.getElementById('rider-contract-form').style.display = 'none';
        document.getElementById('contract-content').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        window.scrollTo(0, 0);
        console.log('Contract submitted successfully:', data.message);
    } else {
        alert('Error: ' + data.message);
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('An error occurred while submitting the form. Please try again or contact us directly at +91-7016899689');
});
```

## Step 4: Test Email Delivery

### Test Checklist:
1. Fill out the contract form completely
2. Use a valid email address you can access
3. Submit the form
4. Check the following:
   - ✅ Rider receives confirmation email at provided address
   - ✅ HR receives notification email at hr@shreejientserv.in
   - ✅ Success message displays on website
   - ✅ Contract log file is created (contract_submissions.log)

### Test Email Addresses:
- Use your personal email first to verify delivery
- Check spam/junk folders if emails don't arrive
- Test with multiple email providers (Gmail, Yahoo, Outlook)

## Step 5: Email Deliverability Best Practices

### Configure SPF Record
Add SPF record to your domain DNS settings in Hostinger:

```
Type: TXT
Host: @
Value: v=spf1 include:titan.email ~all
```

### Configure DKIM
1. Go to Hostinger hPanel
2. Navigate to Emails → Email Settings
3. Enable DKIM authentication
4. Copy the DKIM record
5. Add DKIM record to your domain DNS

### Configure DMARC (Optional but Recommended)
Add DMARC record to DNS:

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:info@shreejientserv.in
```

## Step 6: Monitoring and Maintenance

### Check Email Logs
- Monitor `contract_submissions.log` file for all submissions
- Review for any failed deliveries
- Keep logs for at least 6 months

### Regular Testing
- Test email delivery weekly
- Monitor email account storage quotas
- Check spam scores using mail-tester.com

### Error Handling
If emails fail to send:
1. Check PHP error logs in Hostinger
2. Verify email accounts are active
3. Ensure email quota isn't exceeded
4. Contact Hostinger support if issues persist

## Step 7: Security Considerations

### Rate Limiting (Recommended)
Add rate limiting to prevent spam/abuse:

```php
// Add at the beginning of send-contract-email.php
session_start();
$now = time();
if (isset($_SESSION['last_submission']) && ($now - $_SESSION['last_submission']) < 300) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Please wait 5 minutes between submissions']);
    exit;
}
$_SESSION['last_submission'] = $now;
```

### Input Validation
- Already implemented in both JavaScript and PHP
- Additional server-side validation recommended for production

### HTTPS
- Ensure your website uses HTTPS (SSL certificate)
- Hostinger provides free SSL certificates

## Step 8: Alternative - Using PHPMailer (Advanced)

For better email delivery, consider using PHPMailer library:

### Install PHPMailer via Composer:
```bash
composer require phpmailer/phpmailer
```

### Update send-contract-email.php to use PHPMailer:
```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@shreejientserv.in';
    $mail->Password = 'your_email_password';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    $mail->setFrom('info@shreejientserv.in', 'Shreeji Enterprise Services');
    $mail->addAddress($riderEmail);
    $mail->addBCC('hr@shreejientserv.in');
    
    $mail->isHTML(true);
    $mail->Subject = $emailSubject;
    $mail->Body = $emailBody;
    
    $mail->send();
} catch (Exception $e) {
    error_log("Email sending failed: {$mail->ErrorInfo}");
}
```

## Troubleshooting

### Emails Not Received
1. Check spam/junk folders
2. Verify email accounts exist and have space
3. Check PHP error logs
4. Test with mail() function directly
5. Contact Hostinger support

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify PHP file path is correct
3. Ensure CORS headers are set properly
4. Check file permissions (644 for PHP files)

### Common Hostinger Issues
- **Email quota exceeded**: Upgrade plan or clean old emails
- **SPF/DKIM not set**: Configure in DNS settings
- **Rate limiting**: Hostinger may limit emails per hour
- **Firewall blocks**: Contact Hostinger to whitelist

## Support Contacts

- **Hostinger Support**: https://www.hostinger.com/support
- **Emergency Contact**: +91-7016899689
- **Technical Email**: info@shreejientserv.in

## Additional Resources

- Hostinger Email Documentation: https://support.hostinger.com/en/collections/1742267-email
- PHP mail() function: https://www.php.net/manual/en/function.mail.php
- PHPMailer GitHub: https://github.com/PHPMailer/PHPMailer

---

**Last Updated:** November 12, 2025
**Version:** 1.0
**Author:** Shreeji Enterprise Services Development Team
