<?php
// test-email.php - Simple test to check if email is working
header('Content-Type: text/plain');

echo "Testing email functionality...\n\n";

// Test 1: Check if mail() function exists
if (function_exists('mail')) {
    echo "✓ mail() function is available\n";
} else {
    echo "✗ mail() function is NOT available\n";
    exit;
}

// Test 2: Try sending a simple email
$to = 'info@shreejientserv.in';
$subject = 'Test Email from Website';
$message = 'This is a test email sent at ' . date('Y-m-d H:i:s');
$headers = "From: noreply@shreejientserv.in\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

echo "\nAttempting to send test email to: $to\n";

$result = mail($to, $subject, $message, $headers);

if ($result) {
    echo "✓ mail() function returned TRUE\n";
    echo "Check your inbox at $to\n";
} else {
    echo "✗ mail() function returned FALSE\n";
    echo "Email sending failed. Possible reasons:\n";
    echo "- SMTP not configured on server\n";
    echo "- mail() function disabled\n";
    echo "- Invalid email addresses\n";
}

echo "\n--- Server Info ---\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
?>
