<?php
// Simple test file to check if PHP and mail() work on Hostinger
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Test 1: PHP is working
$tests = [
    'php_version' => phpversion(),
    'mail_function' => function_exists('mail') ? 'Available' : 'NOT Available',
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
];

// Test 2: Try to send a test email
$to = 'info@shreejientserv.in';
$subject = 'Test Email from Hostinger';
$message = 'This is a test email to verify mail() function works.';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Shreeji Enterprise Services <info@shreejientserv.in>\r\n";

$mailResult = @mail($to, $subject, $message, $headers);
$tests['mail_sent'] = $mailResult ? 'SUCCESS' : 'FAILED';
$tests['last_error'] = error_get_last();

echo json_encode([
    'success' => true,
    'message' => 'PHP is working',
    'tests' => $tests
], JSON_PRETTY_PRINT);
?>
