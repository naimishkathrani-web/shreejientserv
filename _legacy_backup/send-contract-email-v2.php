<?php
// Bulletproof error handling and JSON output
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start output buffering to catch any accidental output
ob_start();

try {
    // Set JSON header first
    header('Content-Type: application/json');
    
    // CORS headers
    $allowed_origins = ['https://shreejientserv.in', 'https://www.shreejientserv.in'];
    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        ob_end_clean();
        http_response_code(200);
        exit;
    }
    
    // Only POST allowed
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        ob_end_clean();
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
        exit;
    }
    
    // Get and parse JSON
    $jsonData = file_get_contents('php://input');
    $formData = json_decode($jsonData, true);
    
    if (!$formData) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
        exit;
    }
    
    // Required fields
    $required = ['firstName', 'lastName', 'email', 'mobileNumber', 'acceptanceDate'];
    foreach ($required as $field) {
        if (empty($formData[$field])) {
            ob_end_clean();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing: $field"]);
            exit;
        }
    }
    
    // Extract all data
    $firstName = htmlspecialchars($formData['firstName'] ?? '');
    $lastName = htmlspecialchars($formData['lastName'] ?? '');
    $parentName = htmlspecialchars($formData['parentName'] ?? '');
    $parentMobile = htmlspecialchars($formData['parentMobile'] ?? '');
    $email = filter_var($formData['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $mobile = htmlspecialchars($formData['mobileNumber'] ?? '');
    $dateOfBirth = htmlspecialchars($formData['dateOfBirth'] ?? '');
    $aadharNumber = htmlspecialchars($formData['aadharNumber'] ?? '');
    $panNumber = htmlspecialchars($formData['panNumber'] ?? '');
    $permanentAddress = htmlspecialchars($formData['permanentAddress'] ?? '');
    $currentAddress = htmlspecialchars($formData['currentAddress'] ?? '');
    $workLocation = htmlspecialchars($formData['workLocation'] ?? '');
    $vehicleType = htmlspecialchars($formData['vehicleType'] ?? '');
    $vehicleNumber = htmlspecialchars($formData['vehicleNumber'] ?? '');
    $licenseNumber = htmlspecialchars($formData['licenseNumber'] ?? 'Not Required');
    $hasLicense = isset($formData['hasLicense']) && $formData['hasLicense'] ? 'Yes' : 'No';
    $hasVehicleDocs = isset($formData['hasVehicleDocs']) && $formData['hasVehicleDocs'] ? 'Yes' : 'No';
    $ownDocuments = isset($formData['ownDocuments']) && $formData['ownDocuments'] ? 'Yes' : 'No';
    $dateAccepted = htmlspecialchars($formData['acceptanceDate'] ?? '');
    $signedLocation = htmlspecialchars($formData['signedLocation'] ?? '');
    $language = htmlspecialchars($formData['language'] ?? 'en');
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        ob_end_clean();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email']);
        exit;
    }
    
    // Email settings
    $to = $email;
    $hrEmail = 'hr@shreejientserv.in';
    $from = 'info@shreejientserv.in';
    $subject = 'Freelance Rider Agreement - Contract Accepted - Shreeji Enterprise Services';
    
    // Format vehicle type display
    $vehicleTypeDisplay = ($vehicleType === 'bike') ? 'Bicycle' : (($vehicleType === 'scooter') ? 'Scooter' : 'Motorcycle');
    
    // Comprehensive email body with all contract terms
    $message = "=============================================================\n";
    $message .= "FREELANCE RIDER AGREEMENT - CONTRACT ACCEPTANCE CONFIRMATION\n";
    $message .= "=============================================================\n\n";
    
    $message .= "Dear $firstName $lastName,\n\n";
    $message .= "Thank you for accepting the Freelance Rider Agreement with Shreeji Enterprise Services.\n";
    $message .= "This email confirms your acceptance and contains a summary of the contract terms you have agreed to.\n\n";
    
    $message .= "-------------------------------------------------------------\n";
    $message .= "RIDER PERSONAL INFORMATION\n";
    $message .= "-------------------------------------------------------------\n";
    $message .= "Full Name: $firstName $lastName\n";
    $message .= "Father/Mother Name: $parentName\n";
    $message .= "Date of Birth: $dateOfBirth\n";
    $message .= "Email: $email\n";
    $message .= "Mobile Number: $mobile\n";
    $message .= "Parent/Guardian Mobile: $parentMobile\n";
    $message .= "Aadhar Card Number: $aadharNumber\n";
    $message .= "PAN Card Number: $panNumber\n\n";
    
    $message .= "Permanent Address:\n$permanentAddress\n\n";
    $message .= "Current Address:\n$currentAddress\n\n";
    
    $message .= "-------------------------------------------------------------\n";
    $message .= "WORK & VEHICLE INFORMATION\n";
    $message .= "-------------------------------------------------------------\n";
    $message .= "Work Location: $workLocation\n";
    $message .= "Vehicle Type: $vehicleTypeDisplay\n";
    $message .= "Vehicle Number: $vehicleNumber\n";
    $message .= "Driving License Number: $licenseNumber\n";
    $message .= "Has Valid Driving License: $hasLicense\n";
    $message .= "Has Vehicle Registration Documents: $hasVehicleDocs\n";
    $message .= "Owns Original Aadhar & PAN Documents: $ownDocuments\n\n";
    
    $message .= "-------------------------------------------------------------\n";
    $message .= "CONTRACT ACCEPTANCE DETAILS\n";
    $message .= "-------------------------------------------------------------\n";
    $message .= "Date of Acceptance: $dateAccepted\n";
    $message .= "Location of Acceptance: $signedLocation\n";
    $message .= "Contract Language: " . ($language === 'hi' ? 'Hindi' : 'English') . "\n\n";
    
    $message .= "=============================================================\n";
    $message .= "KEY CONTRACT TERMS ACCEPTED BY RIDER\n";
    $message .= "=============================================================\n\n";
    
    $message .= "1. RELATIONSHIP STATUS\n";
    $message .= "   - You are engaging as an INDEPENDENT FREELANCE CONTRACTOR\n";
    $message .= "   - This is NOT an employer-employee relationship\n";
    $message .= "   - No partnership, joint venture, or agency relationship exists\n\n";
    
    $message .= "2. CONTRACT DURATION\n";
    $message .= "   - Initial 3-month TRIAL PERIOD (at own risk)\n";
    $message .= "   - Upon successful completion: 9-month contract (total 1 year)\n";
    $message .= "   - After 1 year: May be considered for permanent employment\n\n";
    
    $message .= "3. PAYMENT TERMS\n";
    $message .= "   - Rate: Rs. 50 per delivery OR as per Company policy\n";
    $message .= "   - Payment: Daily or weekly basis\n";
    $message .= "   - Deductions: Tax, PF, insurance as per law\n\n";
    
    $message .= "4. TRIAL PERIOD (First 3 Months) - CRITICAL\n";
    $message .= "   - Working ENTIRELY AT YOUR OWN RISK\n";
    $message .= "   - NO medical insurance provided by Company\n";
    $message .= "   - NO accidental insurance coverage\n";
    $message .= "   - NO liability for accidents, injuries, medical expenses\n";
    $message .= "   - Company bears NO responsibility for damages during trial\n";
    $message .= "   - Pedge platform has NO liability during trial period\n\n";
    
    $message .= "5. AFTER TRIAL PERIOD (Upon Successful Completion)\n";
    $message .= "   - Company-provided medical insurance\n";
    $message .= "   - Accidental death coverage\n";
    $message .= "   - Dedicated salary account for payments\n\n";
    
    $message .= "6. SALARY ACCOUNT USAGE (STRICT)\n";
    $message .= "   - Use ONLY for receiving Company remuneration\n";
    $message .= "   - NO personal transactions allowed\n";
    $message .= "   - NO third-party payments allowed\n";
    $message .= "   - Violation = Immediate termination + Legal action\n\n";
    
    $message .= "7. VEHICLE & DOCUMENTS\n";
    $message .= "   - You must maintain valid vehicle documents\n";
    $message .= "   - Driving license must be valid (if applicable)\n";
    $message .= "   - Vehicle insurance required\n";
    $message .= "   - PUC certificate must be current\n\n";
    
    $message .= "8. PEDGE PLATFORM DISCLAIMER\n";
    $message .= "   - Pedge is independent third-party service provider\n";
    $message .= "   - NO relationship/liability with Rider\n";
    $message .= "   - Cannot be held liable for disputes or accidents\n";
    $message .= "   - All responsibilities rest with Rider and/or Company\n\n";
    
    $message .= "9. PROFESSIONAL CONDUCT\n";
    $message .= "   - Maintain professional behavior with customers\n";
    $message .= "   - Follow all traffic rules and safety regulations\n";
    $message .= "   - Wear proper uniform and carry ID card\n";
    $message .= "   - Handle deliveries with care\n\n";
    
    $message .= "10. TERMINATION CONDITIONS\n";
    $message .= "   - Either party can terminate with 15 days notice\n";
    $message .= "   - Company can terminate immediately for misconduct\n";
    $message .= "   - No compensation for early termination during trial\n\n";
    
    $message .= "11. DECLARATION & INDEMNITY\n";
    $message .= "   - All information provided is true and accurate\n";
    $message .= "   - Documents (Aadhar, PAN, License) are genuine\n";
    $message .= "   - You indemnify Company from claims arising from your actions\n";
    $message .= "   - You accept all risks during trial period\n\n";
    
    $message .= "=============================================================\n\n";
    
    $message .= "NEXT STEPS:\n";
    $message .= "1. Our HR team will contact you within 2-3 business days\n";
    $message .= "2. Please keep your original documents ready for verification\n";
    $message .= "3. Ensure your vehicle and license are in valid condition\n";
    $message .= "4. Wait for confirmation call/email before starting work\n\n";
    
    $message .= "IMPORTANT REMINDERS:\n";
    $message .= "- This is a legally binding contract under Indian Contract Act, 1872\n";
    $message .= "- You are working at your own risk during the 3-month trial period\n";
    $message .= "- Insurance benefits apply only after successful trial completion\n";
    $message .= "- Misuse of salary account will result in legal consequences\n\n";
    
    $message .= "If you have any questions or concerns, please contact us:\n";
    $message .= "Email: info@shreejientserv.in\n";
    $message .= "Phone: +91 73830 60401\n";
    $message .= "HR Email: hr@shreejientserv.in\n\n";
    
    $message .= "Best regards,\n";
    $message .= "Shreeji Enterprise Services\n";
    $message .= "Manpower Supply & Recruitment Services\n";
    $message .= "714 The Spire 2 Shital Park, 150 Feet Ring Road\n";
    $message .= "Rajkot, Gujarat - 360005, India\n\n";
    
    $message .= "=============================================================\n";
    $message .= "This is an automated email. Please do not reply directly.\n";
    $message .= "For queries, contact: info@shreejientserv.in\n";
    $message .= "=============================================================\n";
    
    // Email headers
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "Cc: $hrEmail\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Try to send email
    $mailSent = false;
    try {
        $mailSent = @mail($to, $subject, $message, $headers);
    } catch (Exception $e) {
        // Email failed but don't crash
        error_log("Mail error: " . $e->getMessage());
    }
    
    // Clear any buffered output and return success
    ob_end_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contract submitted successfully',
        'emailSent' => $mailSent,
        'rider' => "$firstName $lastName",
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    // Catch any errors
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'line' => $e->getLine()
    ]);
}
?>
