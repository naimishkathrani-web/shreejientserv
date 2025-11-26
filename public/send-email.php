<?php
// send-email.php - Email handler for contract forms
require_once 'smtp-mailer.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log for debugging
error_log("Contract form data received: " . print_r($data, true));

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON', 'received' => substr($input, 0, 100)]);
    exit;
}

// Extract form data
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$parentName = $data['parentName'] ?? '';
$parentMobile = $data['parentMobile'] ?? '';
$email = $data['email'] ?? '';
$dateOfBirth = $data['dateOfBirth'] ?? '';
$aadharNumber = $data['aadharNumber'] ?? '';
$panNumber = $data['panNumber'] ?? '';
$mobileNumber = $data['mobileNumber'] ?? '';
$permanentAddress = $data['permanentAddress'] ?? '';
$currentAddress = $data['currentAddress'] ?? '';
$workLocation = $data['workLocation'] ?? '';
$vehicleType = $data['vehicleType'] ?? '';
$vehicleNumber = $data['vehicleNumber'] ?? '';
$licenseNumber = $data['licenseNumber'] ?? '';
$acceptanceDate = $data['acceptanceDate'] ?? '';
$signedLocation = $data['signedLocation'] ?? '';

// Check if this is existing rider (has riderId field)
$isExistingRider = isset($data['riderId']) && !empty($data['riderId']);
$riderId = $data['riderId'] ?? '';

// Basic validation
if (empty($firstName) || empty($lastName) || empty($email) || empty($mobileNumber)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Build email body
if ($isExistingRider) {
    $subject = 'Existing Rider Contract - ' . $firstName . ' ' . $lastName;
    $body = "EXISTING RIDER CONTRACT SUBMISSION\n";
    $body .= "================================\n\n";
    $body .= "Rider ID: {$riderId}\n\n";
} else {
    $subject = 'New Rider Application - ' . $firstName . ' ' . $lastName;
    $body = "NEW RIDER APPLICATION\n";
    $body .= "====================\n\n";
}

$body .= "PERSONAL INFORMATION:\n";
$body .= "Name: {$firstName} {$lastName}\n";
$body .= "Parent: {$parentName} (Mobile: {$parentMobile})\n";
$body .= "Email: {$email}\n";
$body .= "Date of Birth: {$dateOfBirth}\n";
$body .= "Mobile: {$mobileNumber}\n\n";

$body .= "DOCUMENTS:\n";
$body .= "Aadhar: {$aadharNumber}\n";
$body .= "PAN: {$panNumber}\n\n";

$body .= "ADDRESS:\n";
$body .= "Permanent: {$permanentAddress}\n";
$body .= "Current: {$currentAddress}\n";
$body .= "Work Location: {$workLocation}\n\n";

$body .= "VEHICLE DETAILS:\n";
$body .= "Type: {$vehicleType}\n";
$body .= "Number: {$vehicleNumber}\n";
$body .= "License: {$licenseNumber}\n\n";

$body .= "CONTRACT DETAILS:\n";
$body .= "Acceptance Date: {$acceptanceDate}\n";
$body .= "Signed Location: {$signedLocation}\n\n";

$body .= "---\n";
$body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
$body .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n\n";
$body .= "NOTE: Document uploads should be collected separately.\n";

// Send email using SMTP
$mailer = new SMTPMailer();
$to = 'info@shreejientserv.in';

$mailSent = $mailer->send($to, $subject, $body);

if ($mailSent) {
    error_log("Contract email sent successfully to {$to}");
    echo json_encode([
        'status' => 'success',
        'message' => 'Application submitted successfully. We will contact you shortly.'
    ]);
} else {
    error_log("Failed to send contract email to {$to}");
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email. Please contact us directly at info@shreejientserv.in or call +91-7016899689'
    ]);
}
?>
