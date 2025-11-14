<?php
// Set headers for CORS and JSON response
// Allow both www and non-www origins
$allowed_origins = ['https://shreejientserv.in', 'https://www.shreejientserv.in'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate required fields
    if (empty($data['name']) || empty($data['email']) || empty($data['service']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
        exit;
    }
    
    // Sanitize inputs
    $name = htmlspecialchars(strip_tags(trim($data['name'])));
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $phone = !empty($data['phone']) ? htmlspecialchars(strip_tags(trim($data['phone']))) : 'Not provided';
    $service = htmlspecialchars(strip_tags(trim($data['service'])));
    $message = htmlspecialchars(strip_tags(trim($data['message'])));
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    // Service name mapping
    $serviceNames = [
        'delivery' => 'Delivery & Logistics Personnel',
        'bpo' => 'BPO & BFSI Staffing',
        'it' => 'IT Recruitment',
        'other' => 'Other Services'
    ];
    $serviceName = isset($serviceNames[$service]) ? $serviceNames[$service] : $service;
    
    // Prepare email content
    $to = 'info@shreejientserv.in';
    $subject = 'New Contact Form Submission - ' . $serviceName;
    
    // HTML Email Body
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #667eea; }
            .label { font-weight: 600; color: #667eea; display: block; margin-bottom: 5px; }
            .value { color: #2d3748; }
            .message-box { background: white; padding: 20px; border-radius: 6px; margin-top: 20px; border: 1px solid #e2e8f0; }
            .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #718096; font-size: 0.9rem; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2 style='margin: 0;'>📩 New Contact Form Submission</h2>
                <p style='margin: 10px 0 0 0; opacity: 0.9;'>Shreeji Enterprise Services</p>
            </div>
            
            <div class='content'>
                <div class='info-row'>
                    <span class='label'>Name:</span>
                    <span class='value'>$name</span>
                </div>
                
                <div class='info-row'>
                    <span class='label'>Email:</span>
                    <span class='value'>$email</span>
                </div>
                
                <div class='info-row'>
                    <span class='label'>Phone:</span>
                    <span class='value'>$phone</span>
                </div>
                
                <div class='info-row'>
                    <span class='label'>Service Interested In:</span>
                    <span class='value'>$serviceName</span>
                </div>
                
                <div class='message-box'>
                    <span class='label'>Message:</span>
                    <div class='value' style='margin-top: 10px; white-space: pre-wrap;'>$message</div>
                </div>
                
                <div class='footer'>
                    <p><strong>Shreeji Enterprise Services</strong></p>
                    <p>📧 info@shreejientserv.in | 📱 +91-7016899689</p>
                    <p style='margin-top: 10px; font-size: 0.85rem;'>Received on: " . date('F j, Y, g:i a') . "</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers - Hostinger recommended format
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: Shreeji Enterprise Services <info@shreejientserv.in>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $subject, $emailBody, $headers)) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for contacting us! We will get back to you soon.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send email. Please try again or contact us directly at info@shreejientserv.in'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
