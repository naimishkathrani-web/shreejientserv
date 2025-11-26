<?php
// send-contact.php - Contact form handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Extract form data
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$message = $data['message'] ?? '';

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Email configuration
$company_email = 'info@shreejientserv.in';
$from_email = 'noreply@shreejientserv.in';

// Email 1: Notification to company
$company_subject = 'New Contact Form Inquiry from ' . $name;
$company_body = "New inquiry received from the website:\n\n";
$company_body .= "Name: {$name}\n";
$company_body .= "Email: {$email}\n";
$company_body .= "Phone: {$phone}\n";
$company_body .= "Message:\n{$message}\n\n";
$company_body .= "---\n";
$company_body .= "This inquiry was submitted on " . date('Y-m-d H:i:s') . "\n";

$company_headers = "From: {$from_email}\r\n";
$company_headers .= "Reply-To: {$email}\r\n";
$company_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Email 2: Confirmation to customer
$customer_subject = 'Thank you for contacting Shreeji Enterprise Services';
$customer_body = "Dear {$name},\n\n";
$customer_body .= "Thank you for reaching out to Shreeji Enterprise Services. We have received your inquiry and will get back to you shortly.\n\n";
$customer_body .= "Your message:\n{$message}\n\n";
$customer_body .= "If you have any urgent questions, please feel free to call us at +91-7016899689.\n\n";
$customer_body .= "Best regards,\n";
$customer_body .= "Shreeji Enterprise Services Team\n";
$customer_body .= "Email: info@shreejientserv.in\n";
$customer_body .= "Phone: +91-7016899689\n";

$customer_headers = "From: {$company_email}\r\n";
$customer_headers .= "Reply-To: {$company_email}\r\n";
$customer_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send both emails
$company_sent = mail($company_email, $company_subject, $company_body, $company_headers);
$customer_sent = mail($email, $customer_subject, $customer_body, $customer_headers);

if ($company_sent && $customer_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been sent successfully. Check your email for confirmation.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
