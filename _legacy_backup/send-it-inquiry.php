<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize input data
    $company_name = htmlspecialchars(trim($_POST['company_name']));
    $company_type = htmlspecialchars(trim($_POST['company_type']));
    $contact_person = htmlspecialchars(trim($_POST['contact_person']));
    $designation = htmlspecialchars(trim($_POST['designation']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']));
    $location = htmlspecialchars(trim($_POST['location']));
    $positions = htmlspecialchars(trim($_POST['positions']));
    $role_category = htmlspecialchars(trim($_POST['role_category']));
    $tech_stack = htmlspecialchars(trim($_POST['tech_stack']));
    $experience_level = htmlspecialchars(trim($_POST['experience_level']));
    $engagement_type = htmlspecialchars(trim($_POST['engagement_type']));
    $work_model = htmlspecialchars(trim($_POST['work_model']));
    $timeline = htmlspecialchars(trim($_POST['timeline']));
    $job_description = htmlspecialchars(trim($_POST['job_description']));
    $additional_info = htmlspecialchars(trim($_POST['additional_info']));
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Generate unique inquiry number
    $inquiry_number = 'IT-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    
    // Email to Shreeji Enterprise Services
    $to_company = "info@shreejientserv.in";
    $subject_company = "New IT Recruitment Inquiry - " . $inquiry_number;
    
    $message_company = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2563eb; }
            .value { margin-left: 10px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New IT Recruitment Inquiry</h2>
            <p>Inquiry Number: {$inquiry_number}</p>
        </div>
        <div class='content'>
            <div class='field'><span class='label'>Company Name:</span><span class='value'>{$company_name}</span></div>
            <div class='field'><span class='label'>Company Type:</span><span class='value'>{$company_type}</span></div>
            <div class='field'><span class='label'>Contact Person:</span><span class='value'>{$contact_person}</span></div>
            <div class='field'><span class='label'>Designation:</span><span class='value'>{$designation}</span></div>
            <div class='field'><span class='label'>Email:</span><span class='value'>{$email}</span></div>
            <div class='field'><span class='label'>Phone:</span><span class='value'>{$phone}</span></div>
            <div class='field'><span class='label'>Work Location:</span><span class='value'>{$location}</span></div>
            <div class='field'><span class='label'>Number of Positions:</span><span class='value'>{$positions}</span></div>
            <div class='field'><span class='label'>Role Category:</span><span class='value'>{$role_category}</span></div>
            <div class='field'><span class='label'>Technology Stack:</span><span class='value'>{$tech_stack}</span></div>
            <div class='field'><span class='label'>Experience Level:</span><span class='value'>{$experience_level}</span></div>
            <div class='field'><span class='label'>Engagement Type:</span><span class='value'>{$engagement_type}</span></div>
            <div class='field'><span class='label'>Work Model:</span><span class='value'>{$work_model}</span></div>
            <div class='field'><span class='label'>Timeline:</span><span class='value'>{$timeline}</span></div>
            <div class='field'><span class='label'>Job Description:</span><div class='value'>" . nl2br($job_description) . "</div></div>
            <div class='field'><span class='label'>Additional Information:</span><div class='value'>" . nl2br($additional_info) . "</div></div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers for company
    $headers_company = "MIME-Version: 1.0" . "\r\n";
    $headers_company .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers_company .= "From: noreply@shreejientserv.in" . "\r\n";
    $headers_company .= "Reply-To: {$email}" . "\r\n";
    
    // Email to customer (auto-reply)
    $subject_customer = "Thank You for Your IT Staffing Inquiry - " . $inquiry_number;
    
    $message_customer = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>Thank You for Your IT Staffing Inquiry!</h2>
        </div>
        <div class='content'>
            <p>Dear {$contact_person},</p>
            
            <p>Thank you for reaching out to Shreeji Enterprise Services for your IT recruitment needs.</p>
            
            <p><strong>Your Inquiry Number: {$inquiry_number}</strong></p>
            
            <p>We have received your IT staffing inquiry for <strong>{$company_name}</strong> and our specialized IT recruitment team is reviewing your technical requirements.</p>
            
            <p>One of our IT recruitment specialists will contact you within 24 hours to discuss your technology stack, team requirements, and provide you with qualified candidate profiles.</p>
            
            <p><strong>Your Inquiry Summary:</strong></p>
            <ul>
                <li>Role Category: {$role_category}</li>
                <li>Technology Stack: {$tech_stack}</li>
                <li>Number of Positions: {$positions}</li>
                <li>Location/Work Model: {$location} ({$work_model})</li>
                <li>Timeline: {$timeline}</li>
            </ul>
            
            <p>If you have any urgent requirements or questions, please feel free to call us at <strong>+91-7016899689</strong></p>
            
            <p>Best regards,<br>
            <strong>Shreeji Enterprise Services - IT Recruitment Team</strong><br>
            714 The Spire 2, Rajkot<br>
            Email: info@shreejientserv.in<br>
            Phone: +91-7016899689</p>
        </div>
    </body>
    </html>
    ";
    
    // Email headers for customer
    $headers_customer = "MIME-Version: 1.0" . "\r\n";
    $headers_customer .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers_customer .= "From: Shreeji Enterprise Services <info@shreejientserv.in>" . "\r\n";
    
    // Send both emails
    $mail_to_company = mail($to_company, $subject_company, $message_company, $headers_company);
    $mail_to_customer = mail($email, $subject_customer, $message_customer, $headers_customer);
    
    if ($mail_to_company && $mail_to_customer) {
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you! Your IT staffing inquiry has been submitted successfully. Inquiry Number: ' . $inquiry_number,
            'inquiry_number' => $inquiry_number
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Sorry, there was an error submitting your inquiry. Please try again or contact us directly.'
        ]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
