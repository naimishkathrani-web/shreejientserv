<?php
// send-contact.php - Contact form handler
require_once 'smtp-mailer.php';

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

$mailer = new SMTPMailer();
$company_email = 'info@shreejientserv.in';

// Email 1: Notification to company
$company_subject = 'New Contact Inquiry from ' . $name;
$company_body = "NEW CONTACT FORM INQUIRY\n";
$company_body .= "========================\n\n";
$company_body .= "Name: {$name}\n";
$company_body .= "Email: {$email}\n";
$company_body .= "Phone: {$phone}\n\n";
$company_body .= "Message:\n{$message}\n\n";
$company_body .= "---\n";
$company_body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
$company_body .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";

// Email 2: Confirmation to customer
$customer_subject = 'Thank you for contacting Shreeji Enterprise Services';
$customer_body = "Dear {$name},\n\n";
$customer_body .= "Thank you for reaching out to Shreeji Enterprise Services.\n\n";
$customer_body .= "We have received your inquiry and will get back to you shortly.\n\n";
$customer_body .= "Your message:\n{$message}\n\n";
$customer_body .= "If you have any urgent questions, please feel free to call us at +91-7016899689.\n\n";
$customer_body .= "Best regards,\n";
$customer_body .= "Shreeji Enterprise Services Team\n";
$customer_body .= "Email: info@shreejientserv.in\n";
$customer_body .= "Phone: +91-7016899689\n";

// Send both emails
$company_sent = $mailer->send($company_email, $company_subject, $company_body);
$customer_sent = $mailer->send($email, $customer_subject, $customer_body);

if ($company_sent && $customer_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been sent successfully. Check your email for confirmation.'
    ]);
} else if ($company_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been received. We will contact you shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email. Please contact us directly at info@shreejientserv.in or call +91-7016899689'
    ]);
}
?>
