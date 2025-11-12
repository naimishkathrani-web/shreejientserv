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

// Create email subject
$emailSubject = "Contract accepted by existing rider - $firstName $lastName";

// Create comprehensive email body with legal declaration
$emailBody = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Contract Agreement</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7; color: #1a1a1a; background: #f5f5f5; }
        .email-container { max-width: 800px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 26px; margin-bottom: 10px; font-weight: 600; letter-spacing: 0.5px; }
        .header p { font-size: 14px; opacity: 0.95; margin: 5px 0; }
        .legal-banner { background: #fef9e7; border-top: 4px solid #f59e0b; border-bottom: 4px solid #f59e0b; padding: 20px 30px; text-align: center; }
        .legal-banner h2 { color: #d97706; font-size: 20px; margin-bottom: 8px; }
        .legal-banner p { color: #92400e; font-size: 13px; }
        .declaration { padding: 40px 30px; background: #fffef5; border-left: 6px solid #f59e0b; }
        .declaration h3 { color: #d97706; font-size: 18px; margin-bottom: 20px; }
        .declaration-text { font-size: 15px; line-height: 2; text-align: justify; margin-bottom: 20px; }
        .declaration-text strong { color: #000; font-weight: 600; }
        .declaration-list { margin: 20px 0; padding-left: 30px; }
        .declaration-list li { margin: 12px 0; }
        .personal-info { background: #f9fafb; padding: 30px; border-top: 3px solid #e5e7eb; }
        .personal-info h3 { color: #1e40af; margin-bottom: 20px; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { padding: 12px; background: white; border-left: 3px solid #3b82f6; }
        .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { font-size: 14px; color: #1f2937; font-weight: 500; }
        .terms-section { padding: 30px; }
        .terms-section h3 { color: #1e40af; font-size: 20px; margin-bottom: 15px; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        .terms-section h4 { color: #1f2937; font-size: 16px; margin: 25px 0 12px 0; }
        .terms-section p { margin: 12px 0; text-align: justify; }
        .terms-section ul { padding-left: 25px; margin: 12px 0; }
        .terms-section li { margin: 8px 0; }
        .terms-section strong { color: #000; }
        .important-box { background: #fef2f2; border: 2px solid #dc2626; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .important-box strong { color: #dc2626; }
        .footer { background: #111827; color: #9ca3af; padding: 30px; text-align: center; }
        .footer p { margin: 8px 0; font-size: 13px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
            .header, .declaration, .personal-info, .terms-section { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <!-- Header -->
        <div class='header'>
            <h1>⚖️ LEGAL CONTRACT AGREEMENT</h1>
            <p>Freelance Rider Agreement - Existing Rider Contract Renewal</p>
            <p>Shreeji Enterprise Services, Rajkot, Gujarat, India</p>
            <p>Contract Date: $formattedDate</p>
        </div>
        
        <!-- Legal Banner -->
        <div class='legal-banner'>
            <h2>📜 LEGALLY BINDING DOCUMENT</h2>
            <p>This email constitutes a legally binding contract agreement. Please read carefully and retain for your records.</p>
        </div>
";
