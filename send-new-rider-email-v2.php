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
    
    // Format vehicle type display
    $vehicleTypeDisplay = ($vehicleType === 'bike') ? 'Bicycle' : (($vehicleType === 'scooter') ? 'Scooter' : 'Motorcycle');
    
    // ==========================================
    // EMAIL 1: ACTIVATION NOTIFICATION
    // To: activate@shreejientserv.in + Rider
    // ==========================================
    
    $activationTo = 'activate@shreejientserv.in';
    $activationSubject = 'New Rider Activation Request - ' . $firstName . ' ' . $lastName;
    
    $activationMessage = "=============================================================\n";
    $activationMessage .= "NEW RIDER ACTIVATION REQUEST\n";
    $activationMessage .= "=============================================================\n\n";
    
    $activationMessage .= "Dear Activation Team,\n\n";
    $activationMessage .= "A new rider has submitted their contract and is ready for activation.\n\n";
    
    $activationMessage .= "-------------------------------------------------------------\n";
    $activationMessage .= "RIDER INFORMATION\n";
    $activationMessage .= "-------------------------------------------------------------\n";
    $activationMessage .= "Full Name: $firstName $lastName\n";
    $activationMessage .= "Father/Mother Name: $parentName\n";
    $activationMessage .= "Date of Birth: $dateOfBirth\n";
    $activationMessage .= "Email: $email\n";
    $activationMessage .= "Mobile: $mobile\n";
    $activationMessage .= "Parent Mobile: $parentMobile\n";
    $activationMessage .= "Aadhar: $aadharNumber\n";
    $activationMessage .= "PAN: $panNumber\n\n";
    
    $activationMessage .= "Work Location: $workLocation\n";
    $activationMessage .= "Vehicle: $vehicleTypeDisplay - $vehicleNumber\n";
    $activationMessage .= "License: $licenseNumber\n";
    $activationMessage .= "Date Accepted: $dateAccepted\n";
    $activationMessage .= "Location: $signedLocation\n\n";
    
    $activationMessage .= "-------------------------------------------------------------\n";
    $activationMessage .= "ACTIVATION STATUS\n";
    $activationMessage .= "-------------------------------------------------------------\n";
    $activationMessage .= "✅ Contract Submitted: " . date('Y-m-d H:i:s') . "\n";
    $activationMessage .= "⏳ Activation Status: IN PROGRESS\n";
    $activationMessage .= "📧 Confirmation Email: Sent to rider\n\n";
    
    $activationMessage .= "NEXT STEPS:\n";
    $activationMessage .= "1. Verify documents (Aadhar, PAN, License)\n";
    $activationMessage .= "2. Conduct background verification\n";
    $activationMessage .= "3. Schedule training session\n";
    $activationMessage .= "4. Activate Pedge platform account\n";
    $activationMessage .= "5. Send activation confirmation to rider\n\n";
    
    $activationMessage .= "The rider has been notified that their application is being processed.\n";
    $activationMessage .= "Expected activation time: 4-7 business days\n\n";
    
    $activationMessage .= "Best regards,\n";
    $activationMessage .= "Automated Contract Processing System\n";
    $activationMessage .= "Shreeji Enterprise Services\n";
    
    // Headers for activation email - CC to rider
    $activationHeaders = "From: info@shreejientserv.in\r\n";
    $activationHeaders .= "Reply-To: info@shreejientserv.in\r\n";
    $activationHeaders .= "Cc: $email\r\n";
    $activationHeaders .= "X-Mailer: PHP/" . phpversion();
    
    // Send activation email
    $activationSent = false;
    try {
        $activationSent = @mail($activationTo, $activationSubject, $activationMessage, $activationHeaders);
    } catch (Exception $e) {
        error_log("Activation email error: " . $e->getMessage());
    }
    
    // Small delay between emails
    sleep(1);
    
    // ==========================================
    // EMAIL 2: CONTRACT DETAILS WITH FULL TERMS
    // To: hr@shreejientserv.in + Rider
    // ==========================================
    
    $contractTo = $email;
    $hrEmail = 'hr@shreejientserv.in';
    $contractSubject = 'New Rider Contract Agreement - Complete Terms & Conditions - ' . $firstName . ' ' . $lastName;
    
    // Comprehensive contract email (same as existing rider email)
    $contractMessage = "=============================================================\n";
    $contractMessage .= "FREELANCE RIDER AGREEMENT - NEW RIDER CONTRACT\n";
    $contractMessage .= "=============================================================\n\n";
    
    $contractMessage .= "Dear $firstName $lastName,\n\n";
    $contractMessage .= "Welcome to Shreeji Enterprise Services!\n\n";
    $contractMessage .= "Your NEW RIDER contract has been submitted and accepted.\n";
    $contractMessage .= "This email contains the complete terms and conditions of your agreement.\n\n";
    
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "RIDER PERSONAL INFORMATION\n";
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "Full Name: $firstName $lastName\n";
    $contractMessage .= "Father/Mother Name: $parentName\n";
    $contractMessage .= "Date of Birth: $dateOfBirth\n";
    $contractMessage .= "Email: $email\n";
    $contractMessage .= "Mobile Number: $mobile\n";
    $contractMessage .= "Parent/Guardian Mobile: $parentMobile\n";
    $contractMessage .= "Aadhar Card Number: $aadharNumber\n";
    $contractMessage .= "PAN Card Number: $panNumber\n\n";
    
    $contractMessage .= "Permanent Address:\n$permanentAddress\n\n";
    $contractMessage .= "Current Address:\n$currentAddress\n\n";
    
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "WORK & VEHICLE INFORMATION\n";
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "Work Location: $workLocation\n";
    $contractMessage .= "Vehicle Type: $vehicleTypeDisplay\n";
    $contractMessage .= "Vehicle Number: $vehicleNumber\n";
    $contractMessage .= "Driving License Number: $licenseNumber\n";
    $contractMessage .= "Has Valid Driving License: $hasLicense\n";
    $contractMessage .= "Has Vehicle Registration Documents: $hasVehicleDocs\n";
    $contractMessage .= "Owns Original Aadhar & PAN Documents: $ownDocuments\n\n";
    
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "CONTRACT ACCEPTANCE DETAILS\n";
    $contractMessage .= "-------------------------------------------------------------\n";
    $contractMessage .= "Date of Acceptance: $dateAccepted\n";
    $contractMessage .= "Location of Acceptance: $signedLocation\n";
    $contractMessage .= "Contract Language: " . ($language === 'hi' ? 'Hindi' : 'English') . "\n";
    $contractMessage .= "Contract Type: NEW RIDER (3-Month Trial Period)\n\n";
    
    $contractMessage .= "=============================================================\n";
    $contractMessage .= "KEY CONTRACT TERMS ACCEPTED BY RIDER\n";
    $contractMessage .= "=============================================================\n\n";
    
    $contractMessage .= "1. RELATIONSHIP STATUS\n";
    $contractMessage .= "   - You are engaging as an INDEPENDENT FREELANCE CONTRACTOR\n";
    $contractMessage .= "   - This is NOT an employer-employee relationship\n";
    $contractMessage .= "   - No partnership, joint venture, or agency relationship exists\n\n";
    
    $contractMessage .= "2. CONTRACT DURATION - NEW RIDER\n";
    $contractMessage .= "   - 3-MONTH TRIAL PERIOD (at own risk)\n";
    $contractMessage .= "   - Upon successful completion: May be offered fixed-term contract\n";
    $contractMessage .= "   - Performance evaluation required for contract extension\n\n";
    
    $contractMessage .= "3. PAYMENT TERMS\n";
    $contractMessage .= "   - Rate: Rs. 50 per delivery OR as per Company policy\n";
    $contractMessage .= "   - Payment: Daily or weekly basis\n";
    $contractMessage .= "   - Deductions: Tax, PF, insurance as per law\n\n";
    
    $contractMessage .= "4. TRIAL PERIOD (3 Months) - CRITICAL\n";
    $contractMessage .= "   - Working ENTIRELY AT YOUR OWN RISK\n";
    $contractMessage .= "   - NO medical insurance provided by Company\n";
    $contractMessage .= "   - NO accidental insurance coverage\n";
    $contractMessage .= "   - NO liability for accidents, injuries, medical expenses\n";
    $contractMessage .= "   - Company bears NO responsibility for damages during trial\n";
    $contractMessage .= "   - Pedge platform has NO liability during trial period\n\n";
    
    $contractMessage .= "5. AFTER SUCCESSFUL TRIAL COMPLETION\n";
    $contractMessage .= "   - May be offered fixed-term contract\n";
    $contractMessage .= "   - Company-provided medical insurance (if contract offered)\n";
    $contractMessage .= "   - Accidental death coverage (if contract offered)\n";
    $contractMessage .= "   - Dedicated salary account for payments\n\n";
    
    $contractMessage .= "6. MDND POLICY (ZERO TOLERANCE)\n";
    $contractMessage .= "   - Misdelivery = Immediate termination\n";
    $contractMessage .= "   - Damage to goods = Immediate termination\n";
    $contractMessage .= "   - Non-delivery = Immediate termination\n";
    $contractMessage .= "   - Financial liability for lost/damaged items\n\n";
    
    $contractMessage .= "7. VEHICLE & DOCUMENTS\n";
    $contractMessage .= "   - Must maintain valid vehicle documents\n";
    $contractMessage .= "   - Driving license must be valid (if applicable)\n";
    $contractMessage .= "   - Vehicle insurance required\n";
    $contractMessage .= "   - PUC certificate must be current\n\n";
    
    $contractMessage .= "8. PEDGE PLATFORM DISCLAIMER\n";
    $contractMessage .= "   - Pedge is independent third-party service provider\n";
    $contractMessage .= "   - NO relationship/liability with Rider\n";
    $contractMessage .= "   - Cannot be held liable for disputes or accidents\n";
    $contractMessage .= "   - All responsibilities rest with Rider and/or Company\n\n";
    
    $contractMessage .= "9. PROFESSIONAL CONDUCT\n";
    $contractMessage .= "   - Maintain professional behavior with customers\n";
    $contractMessage .= "   - Follow all traffic rules and safety regulations\n";
    $contractMessage .= "   - Wear proper uniform and carry ID card\n";
    $contractMessage .= "   - Handle deliveries with care\n\n";
    
    $contractMessage .= "10. TERMINATION CONDITIONS\n";
    $contractMessage .= "   - Either party can terminate with 7 days notice\n";
    $contractMessage .= "   - Company can terminate immediately for misconduct\n";
    $contractMessage .= "   - No compensation for early termination during trial\n\n";
    
    $contractMessage .= "11. DECLARATION & INDEMNITY\n";
    $contractMessage .= "   - All information provided is true and accurate\n";
    $contractMessage .= "   - Documents (Aadhar, PAN, License) are genuine\n";
    $contractMessage .= "   - You indemnify Company from claims arising from your actions\n";
    $contractMessage .= "   - You accept all risks during trial period\n\n";
    
    $contractMessage .= "=============================================================\n\n";
    
    $contractMessage .= "ACTIVATION PROCESS:\n";
    $contractMessage .= "Your details have been submitted to our activation team (activate@shreejientserv.in)\n";
    $contractMessage .= "They will process your application and contact you within 4-7 business days.\n\n";
    
    $contractMessage .= "ACTIVATION STEPS:\n";
    $contractMessage .= "1. Document verification (Aadhar, PAN, License)\n";
    $contractMessage .= "2. Background verification\n";
    $contractMessage .= "3. Training session scheduling\n";
    $contractMessage .= "4. Pedge platform account creation\n";
    $contractMessage .= "5. Trial period commencement\n\n";
    
    $contractMessage .= "IMPORTANT REMINDERS:\n";
    $contractMessage .= "- Keep your phone accessible at $mobile\n";
    $contractMessage .= "- Ensure $vehicleTypeDisplay is in good working condition\n";
    $contractMessage .= "- Keep all original documents ready for verification\n";
    $contractMessage .= "- You are working at your own risk during trial period\n";
    $contractMessage .= "- This is a legally binding contract under Indian Contract Act, 1872\n\n";
    
    $contractMessage .= "If you have any questions or concerns, please contact us:\n";
    $contractMessage .= "Email: info@shreejientserv.in\n";
    $contractMessage .= "Phone: +91 73830 60401\n";
    $contractMessage .= "HR Email: hr@shreejientserv.in\n";
    $contractMessage .= "Activation Team: activate@shreejientserv.in\n\n";
    
    $contractMessage .= "Best regards,\n";
    $contractMessage .= "Shreeji Enterprise Services\n";
    $contractMessage .= "Manpower Supply & Recruitment Services\n";
    $contractMessage .= "714 The Spire 2 Shital Park, 150 Feet Ring Road\n";
    $contractMessage .= "Rajkot, Gujarat - 360005, India\n\n";
    
    $contractMessage .= "=============================================================\n";
    $contractMessage .= "This is an automated email. Please do not reply directly.\n";
    $contractMessage .= "For queries, contact: info@shreejientserv.in\n";
    $contractMessage .= "=============================================================\n";
    
    // Headers for contract email - CC to HR
    $contractHeaders = "From: info@shreejientserv.in\r\n";
    $contractHeaders .= "Reply-To: info@shreejientserv.in\r\n";
    $contractHeaders .= "Cc: $hrEmail\r\n";
    $contractHeaders .= "X-Mailer: PHP/" . phpversion();
    
    // Send contract email
    $contractSent = false;
    try {
        $contractSent = @mail($contractTo, $contractSubject, $contractMessage, $contractHeaders);
    } catch (Exception $e) {
        error_log("Contract email error: " . $e->getMessage());
    }
    
    // Clear any buffered output and return success
    ob_end_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contract submitted successfully! Two emails sent: (1) Activation notification, (2) Complete contract terms',
        'activationEmailSent' => $activationSent,
        'contractEmailSent' => $contractSent,
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
