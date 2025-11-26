<?php
// send-email.php - Email handler for contract forms
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
    echo json_encode(['error' => 'Invalid JSON', 'received' => $input]);
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
    $subject = 'Existing Rider Contract Submission - ' . $firstName . ' ' . $lastName;
    $body = "Existing Rider Contract Submission\n\n";
    $body .= "Rider ID: {$riderId}\n";
} else {
    $subject = 'New Rider Application - ' . $firstName . ' ' . $lastName;
    $body = "New Rider Application Submission\n\n";
}

$body .= "Name: {$firstName} {$lastName}\n";
$body .= "Parent: {$parentName} (Mobile: {$parentMobile})\n";
$body .= "Email: {$email}\n";
$body .= "DOB: {$dateOfBirth}\n";
$body .= "Aadhar: {$aadharNumber}\n";
$body .= "PAN: {$panNumber}\n";
$body .= "Mobile: {$mobileNumber}\n";
$body .= "Permanent Address: {$permanentAddress}\n";
$body .= "Current Address: {$currentAddress}\n";
$body .= "Work Location: {$workLocation}\n";
$body .= "Vehicle Type: {$vehicleType}\n";
$body .= "Vehicle Number: {$vehicleNumber}\n";
$body .= "License Number: {$licenseNumber}\n";
$body .= "Acceptance Date: {$acceptanceDate}\n";
$body .= "Signed Location: {$signedLocation}\n";
$body .= "\n---\n";
$body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$body .= "\nNote: Document uploads (Aadhar, PAN, License, etc.) should be collected separately.\n";

// Email configuration
$to = 'info@shreejientserv.in';
$from = 'noreply@shreejientserv.in';
$headers = "From: {$from}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $subject, $body, $headers);

if ($mailSent) {
    error_log("Contract email sent successfully to {$to}");
    echo json_encode([
        'status' => 'success',
        'message' => 'Application submitted successfully. We will contact you shortly.'
    ]);
} else {
    error_log("Failed to send contract email to {$to}");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email. Please try again or contact us directly.']);
}
?>
