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
    
    // Extract data
    $firstName = htmlspecialchars($formData['firstName'] ?? '');
    $lastName = htmlspecialchars($formData['lastName'] ?? '');
    $email = filter_var($formData['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $mobile = htmlspecialchars($formData['mobileNumber'] ?? '');
    $dateAccepted = htmlspecialchars($formData['acceptanceDate'] ?? '');
    
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
    $subject = 'Contract Agreement - Shreeji Enterprise Services';
    
    // Simple email body
    $message = "Dear $firstName $lastName,\n\n";
    $message .= "Thank you for submitting your contract agreement.\n\n";
    $message .= "Contract Details:\n";
    $message .= "Name: $firstName $lastName\n";
    $message .= "Email: $email\n";
    $message .= "Mobile: $mobile\n";
    $message .= "Date Accepted: $dateAccepted\n\n";
    $message .= "Our HR team will contact you shortly.\n\n";
    $message .= "Best regards,\n";
    $message .= "Shreeji Enterprise Services\n";
    $message .= "Phone: +91 73830 60401\n";
    $message .= "Email: info@shreejientserv.in";
    
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
