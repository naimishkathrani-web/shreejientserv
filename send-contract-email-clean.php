<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/contract_email_errors.log');

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed']);
    exit;
}

// Get POST data
$jsonData = file_get_contents('php://input');
$formData = json_decode($jsonData, true);

if (!$formData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$requiredFields = ['firstName', 'lastName', 'parentName', 'parentMobile', 'email', 'dateOfBirth', 
                   'aadharNumber', 'panNumber', 'mobileNumber', 'permanentAddress', 'currentAddress', 
                   'workLocation', 'vehicleType', 'acceptanceDate', 'signedLocation', 'language'];

foreach ($requiredFields as $field) {
    if (empty($formData[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize inputs
$firstName = htmlspecialchars($formData['firstName']);
$lastName = htmlspecialchars($formData['lastName']);
$parentName = htmlspecialchars($formData['parentName']);
$parentMobile = htmlspecialchars($formData['parentMobile']);
$riderEmail = filter_var($formData['email'], FILTER_SANITIZE_EMAIL);
$dateOfBirth = htmlspecialchars($formData['dateOfBirth']);
$aadharNumber = htmlspecialchars($formData['aadharNumber']);
$panNumber = htmlspecialchars($formData['panNumber']);
$mobileNumber = htmlspecialchars($formData['mobileNumber']);
$permanentAddress = htmlspecialchars($formData['permanentAddress']);
$currentAddress = htmlspecialchars($formData['currentAddress']);
$workLocation = htmlspecialchars($formData['workLocation']);
$vehicleType = htmlspecialchars($formData['vehicleType']);
$vehicleNumber = htmlspecialchars($formData['vehicleNumber']);
$licenseNumber = isset($formData['licenseNumber']) ? htmlspecialchars($formData['licenseNumber']) : 'Not Required';
$acceptanceDate = htmlspecialchars($formData['acceptanceDate']);
$signedLocation = htmlspecialchars($formData['signedLocation']);
$language = htmlspecialchars($formData['language']);
$submittedAt = htmlspecialchars($formData['submittedAt']);

// Email configuration
$from = 'info@shreejientserv.in';
$fromName = 'Shreeji Enterprise Services';
$hrEmail = 'hr@shreejientserv.in';

// Validate rider email
if (!filter_var($riderEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Format date nicely
$dateObj = DateTime::createFromFormat('Y-m-d', $acceptanceDate);
$formattedDate = $dateObj ? $dateObj->format('d F Y') : $acceptanceDate;

// Mask sensitive data for display
$maskedAadhar = 'XXXX-XXXX-' . substr($aadharNumber, -4);
$maskedPAN = substr($panNumber, 0, 3) . 'XXXXXX' . substr($panNumber, -2);

// TO BE CONTINUED - Email template will be added next
?>
