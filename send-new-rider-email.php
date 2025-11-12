<?php
/**
 * Rider Contract Email Sender for Hostinger
 * 
 * This script sends the completed rider contract to:
 * 1. The rider's email address (provided in the form)
 * 2. HR department (hr@shreejientserv.in)
 * 
 * HOSTING: Designed for Hostinger hosting environment
 * SENDER: info@shreejientserv.in
 * 
 * SETUP INSTRUCTIONS FOR HOSTINGER:
 * 1. Upload this file to public_html folder
 * 2. Ensure your domain email (info@shreejientserv.in) is created in Hostinger email section
 * 3. Update contract-script.js to send form data to this PHP script via fetch/AJAX
 * 4. Test email delivery before going live
 */

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS (if needed)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data from request
$jsonData = file_get_contents('php://input');
$formData = json_decode($jsonData, true);

// Validate required fields
$requiredFields = ['firstName', 'lastName', 'parentName', 'parentMobile', 'email', 'aadharNumber', 
                   'panNumber', 'mobileNumber', 'permanentAddress', 'currentAddress', 'workLocation', 
                   'vehicleType', 'acceptanceDate', 'language'];

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
$aadharNumber = htmlspecialchars($formData['aadharNumber']);
$panNumber = htmlspecialchars($formData['panNumber']);
$mobileNumber = htmlspecialchars($formData['mobileNumber']);
$permanentAddress = htmlspecialchars($formData['permanentAddress']);
$currentAddress = htmlspecialchars($formData['currentAddress']);
$workLocation = htmlspecialchars($formData['workLocation']);
$vehicleType = htmlspecialchars($formData['vehicleType']);
$vehicleNumber = htmlspecialchars($formData['vehicleNumber']);
$acceptanceDate = htmlspecialchars($formData['acceptanceDate']);
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

// Create HTML email template
$emailSubject = "Contract accepted new activation in progress - $firstName $lastName";

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>"
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
        .info-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #1f2937; }
        .value { color: #4b5563; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        .important { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Rider Agreement Confirmation</h1>
            <p>Shreeji Enterprise Services</p>
        </div>
        
        <div class='content'>
            <h2>Dear $firstName $lastName,</h2>
            <p>Thank you for submitting your freelance rider agreement. Your application has been received and is under review.</p>
            
            <div class='important'>
                <strong>⚠️ Important:</strong> This is a 3-month trial period engagement. Please review all terms and conditions carefully.
            </div>
            
            <h3>Submitted Information:</h3>
            
            <div class='info-row'>
                <span class='label'>Full Name:</span>
                <span class='value'>$firstName $lastName</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Father/Mother Name:</span>
                <span class='value'>$parentName</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Contact Number:</span>
                <span class='value'>$mobileNumber</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Parent Contact:</span>
                <span class='value'>$parentMobile</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Email:</span>
                <span class='value'>$riderEmail</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Aadhar Number:</span>
                <span class='value'>XXXX-XXXX-" . substr($aadharNumber, -4) . "</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>PAN Number:</span>
                <span class='value'>" . substr($panNumber, 0, 3) . "XX" . substr($panNumber, -2) . "</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Work Location:</span>
                <span class='value'>$workLocation</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Vehicle Type:</span>
                <span class='value'>$vehicleType</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Vehicle Number:</span>
                <span class='value'>$vehicleNumber</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Acceptance Date:</span>
                <span class='value'>$acceptanceDate</span>
            </div>
            
            <div class='info-row'>
                <span class='label'>Preferred Language:</span>
                <span class='value'>$language</span>
            </div>
            
            <h3>Next Steps:</h3>
            <ol>
                <li>Our HR team will review your application within 2-3 business days</li>
                <li>You will be contacted for document verification</li>
                <li>Upon approval, you will receive onboarding instructions</li>
            </ol>
            
            <p><strong>Contact Information:</strong></p>
            <p>
                Shreeji Enterprise Services<br>
                714 The Spire 2, Shital Park<br>
                150 Feet Ring Road, Rajkot, Gujarat - 360005<br>
                Phone: +91-7016899689<br>
                Email: info@shreejientserv.in<br>
                Website: www.shreejientserv.in
            </p>
        </div>
        
        <div class='footer'>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; " . date('Y') . " Shreeji Enterprise Services. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $fromName <$from>" . "\r\n";
$headers .= "Reply-To: $from" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email to rider
$riderEmailSent = mail($riderEmail, $emailSubject, $emailBody, $headers);

// Create HR notification email
$hrSubject = "Contract accepted new activation in progress - $firstName $lastName";
$hrBody = str_replace(
    "<h2>Dear $firstName $lastName,</h2>
            <p>Thank you for submitting your freelance rider agreement. Your application has been received and is under review.</p>",
    "<h2>New Rider Application</h2>
            <p>A new rider agreement has been submitted and requires review.</p>
            <p><strong>Submitted At:</strong> $submittedAt</p>",
    $emailBody
);

// Send email to HR
$hrEmailSent = mail($hrEmail, $hrSubject, $hrBody, $headers);

// Log the submission (optional - create logs directory first)
$logEntry = date('Y-m-d H:i:s') . " | $firstName $lastName | $riderEmail | $mobileNumber | $workLocation\n";
file_put_contents('contract_submissions.log', $logEntry, FILE_APPEND);

// Return response
if ($riderEmailSent && $hrEmailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contract submitted successfully! Confirmation emails sent.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Contract submitted but email delivery failed. Please contact us directly.'
    ]);
}
?>
