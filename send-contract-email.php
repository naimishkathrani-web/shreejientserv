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
        
        <!-- Declaration Section -->
        <div class='declaration'>
            <h3>DECLARATION OF VOLUNTARY AGREEMENT</h3>
            <div class='declaration-text'>
                <p>I, <strong>$firstName $lastName</strong>, son/daughter of <strong>$parentName</strong>, born on <strong>$dateOfBirth</strong>, currently residing at <strong>$currentAddress</strong>, with permanent address at <strong>$permanentAddress</strong>, hereby solemnly declare and confirm the following:</p>
                
                <p>I am entering into this freelance rider agreement with <strong>Shreeji Enterprise Services</strong>, having its registered office at 714 The Spyre 2 Sheetal Park, 150 Feet Ring Road, Rajkot, Gujarat - 360005, India, on this day of <strong>$formattedDate</strong> at <strong>$signedLocation</strong>.</p>
                
                <p><strong>I HEREBY CONFIRM AND DECLARE THAT:</strong></p>
                <ul class='declaration-list'>
                    <li>I will abide by all the terms and conditions mentioned below at all times until the end of this 3-month freelance contract period with Shreeji Enterprise Services.</li>
                    <li>I am agreeing to these terms and conditions in full confidence and in full consciousness, with complete understanding of my rights and obligations.</li>
                    <li>I have <strong>NOT</strong> been forced, coerced, threatened, or pressured by any individual, any party, or by Shreeji Enterprise Services to agree to these terms and conditions.</li>
                    <li>I am entering into this agreement of my own free will and volition, after having read and understood all terms completely in my preferred language.</li>
                    <li>All information provided by me in this agreement is true, accurate, complete, and provided voluntarily to the best of my knowledge and belief.</li>
                    <li>I understand this is a legally binding contract and I accept full responsibility for compliance with all stated terms.</li>
                </ul>
            </div>
        </div>
        
        <!-- Personal Information Section -->
        <div class='personal-info'>
            <h3>CONTRACT PARTICIPANT INFORMATION</h3>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='info-label'>Full Name</div>
                    <div class='info-value'>$firstName $lastName</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Parent/Guardian Name</div>
                    <div class='info-value'>$parentName</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Date of Birth</div>
                    <div class='info-value'>$dateOfBirth</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Contact Number</div>
                    <div class='info-value'>$mobileNumber</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Parent Contact</div>
                    <div class='info-value'>$parentMobile</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Email Address</div>
                    <div class='info-value'>$riderEmail</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Aadhar Number</div>
                    <div class='info-value'>$maskedAadhar</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>PAN Number</div>
                    <div class='info-value'>$maskedPAN</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Work Location</div>
                    <div class='info-value'>$workLocation</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Vehicle Type</div>
                    <div class='info-value'>" . ucfirst($vehicleType) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Vehicle Registration</div>
                    <div class='info-value'>$vehicleNumber</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>License Number</div>
                    <div class='info-value'>$licenseNumber</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Contract Date</div>
                    <div class='info-value'>$formattedDate</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Signed At</div>
                    <div class='info-value'>$signedLocation</div>
                </div>
            </div>
        </div>
        
        <!-- Contract Terms Section -->
        <div class='terms-section'>
            <h3>COMPLETE TERMS AND CONDITIONS OF AGREEMENT</h3>
            
            <h4>1. Nature of Engagement - Independent Contractor Relationship</h4>
            <p>The Rider acknowledges and agrees that they are engaging with the Company as an <strong>independent freelance contractor</strong> and not as an employee. This is a <strong>3-month trial period engagement</strong> starting from the date of acceptance. No employer-employee relationship, partnership, joint venture, or agency relationship is created by this agreement.</p>
            
            <h4>2. Third-Party Platform Usage - Pedge Mobile Application</h4>
            <p><strong>Important Notice:</strong> During the provision of delivery services, the Rider will be required to use the <strong>Pedge Mobile Application</strong>, which is a third-party technology platform service provider. The Rider expressly acknowledges that Pedge, its owners, directors, shareholders, employees, platform developers, technology partners, and associated companies are independent third-party service providers and have no relationship, liability, or responsibility towards the Rider.</p>
            
            <h4>3. Payment Structure and Remuneration</h4>
            <p>The Rider shall be paid on a <strong>daily or weekly basis</strong> according to the following delivery-based payment structure:</p>
            <ul>
                <li><strong>9 orders per day:</strong> ₹500/-</li>
                <li><strong>17 orders per day:</strong> ₹1,000/-</li>
                <li><strong>26 orders per day:</strong> ₹2,000/-</li>
                <li><strong>37 orders per day:</strong> ₹4,000/-</li>
            </ul>
            <p>A \"day\" is defined as a period starting and ending at <strong>5:30 AM each day</strong>. Payment will be processed on a daily or weekly basis as determined by the Company's payment schedule. All payments are subject to successful completion and verification of deliveries.</p>
            
            <h4>4. Work Schedule and Flexibility</h4>
            <p>As an independent contractor, the Rider has the flexibility to set their own working hours and schedule. However, the Rider is expected to commit to a minimum of <strong>6 days per week</strong> during the trial period to meet performance benchmarks. The Rider may choose their working hours, but must maintain professional service standards during accepted delivery assignments.</p>
            
            <h4>5. Vehicle Requirements and Documentation</h4>
            <p>The Rider confirms ownership or authorized use of: <strong>" . ucfirst($vehicleType) . "</strong> with registration number <strong>$vehicleNumber</strong>. The Rider must maintain valid documents including:</p>
            <ul>
                <li>Valid Driving License (if required): $licenseNumber</li>
                <li>Vehicle Registration Certificate (RC)</li>
                <li>Valid Motor Insurance Policy</li>
                <li>Pollution Under Control (PUC) Certificate</li>
            </ul>
            <p>The Rider is solely responsible for maintaining all vehicle documentation and ensuring compliance with traffic regulations.</p>
            
            <h4>6. MDND Policy - Misdelivery, Damage, and Non-Delivery</h4>
            <div class='important-box'>
                <p><strong>⚠️ CRITICAL POLICY:</strong></p>
                <ul>
                    <li><strong>Zero Tolerance Policy:</strong> Any instance of misdelivery (wrong delivery), damage to goods, or non-delivery will result in immediate termination of this agreement.</li>
                    <li><strong>Financial Liability:</strong> The Rider shall be fully liable for the cost of any lost, damaged, or misdelivered items.</li>
                    <li><strong>No Appeals:</strong> MDND incidents result in automatic contract termination with no right to appeal or re-engagement.</li>
                    <li><strong>Duty of Care:</strong> The Rider must handle all items with utmost care and ensure proper delivery to the correct recipient.</li>
                </ul>
            </div>
            
            <h4>7. Insurance Requirements During Trial Period</h4>
            <p>During the <strong>3-month trial period</strong>, the Rider is responsible for their own insurance coverage. The Company does not provide medical insurance, accident insurance, or any other insurance coverage during the trial period. The Rider is working entirely at their own risk.</p>
            <p><strong>Post-Trial Benefits:</strong> Upon successful completion of the 3-month trial period and transition to a fixed-term contract, the Rider will be eligible for medical insurance coverage and other benefits as per Company policy.</p>
            
            <h4>8. Document Authenticity and Information Accuracy</h4>
            <p>The Rider confirms that:</p>
            <ul>
                <li>The provided <strong>Aadhar Card</strong> ($maskedAadhar) belongs to the Rider and contains accurate information</li>
                <li>The provided <strong>PAN Card</strong> ($maskedPAN) belongs to the Rider and contains accurate information</li>
                <li>All submitted documents are genuine, unaltered, and legally valid</li>
                <li>All personal information provided (name, address, contact details) is true and accurate to the best of their knowledge</li>
            </ul>
            <p>Providing false, forged, or misleading documents/information will result in immediate termination, legal action, and reporting to law enforcement authorities.</p>
            
            <h4>9. Liability and Indemnification</h4>
            <p>The Rider agrees to indemnify and hold harmless Shreeji Enterprise Services, its directors, officers, employees, and agents from any claims, damages, losses, or expenses arising from:</p>
            <ul>
                <li>The Rider's negligence or willful misconduct</li>
                <li>Violation of traffic laws or regulations</li>
                <li>Damage to third-party property or injury to third parties</li>
                <li>Breach of any terms of this agreement</li>
                <li>Any misrepresentation of facts or documents</li>
            </ul>
        </div>
        
        <div class='term'>
            <h4>10. Termination Conditions</h4>
            <p><strong>Either party may terminate this agreement with proper notice:</strong></p>
            <ul>
                <li><strong>By the Rider:</strong> 7 days written notice to the Company</li>
                <li><strong>By the Company:</strong> Immediate termination for violations of MDND policy, document fraud, or breach of terms</li>
                <li><strong>Mutual Termination:</strong> Both parties may agree to terminate immediately by mutual written consent</li>
                <li><strong>End of Trial Period:</strong> Either party may choose not to continue after 3-month trial completion</li>
            </ul>
            <p>Upon termination, the Rider must return all Company property including uniform, ID card, and any equipment provided. Final payment will be processed after settlement of any outstanding dues or damages.</p>
        </div>
        
        <div class='term'>
            <h4>11. Confidentiality and Non-Disclosure</h4>
            <p>The Rider agrees to maintain strict confidentiality regarding:</p>
            <ul>
                <li>Customer information including names, addresses, contact details, and order information</li>
                <li>Company business operations, strategies, and internal processes</li>
                <li>Payment structures, commission rates, and financial arrangements</li>
                <li>Proprietary information related to the Pedge platform or other systems used</li>
            </ul>
            <p>This confidentiality obligation continues even after termination of this agreement. Breach of confidentiality may result in legal action and claims for damages.</p>
        </div>
        
        <div class='term'>
            <h4>12. Intellectual Property Rights</h4>
            <p>The Rider acknowledges that all intellectual property related to the Company's business, including but not limited to trademarks, logos, trade names (such as "Shreeji Enterprise Services"), mobile applications, software, and business processes, are the exclusive property of their respective owners.</p>
            <p>The Rider is granted a limited, non-exclusive license to use Company-provided materials solely for the purpose of performing delivery services during the term of this agreement. No rights of ownership are transferred.</p>
        </div>
        
        <div class='term'>
            <h4>13. Data Privacy and Protection</h4>
            <p>The Company is committed to protecting the Rider's personal information in accordance with applicable data privacy laws. The personal information provided (including Aadhar " . $maskedAadhar . ", PAN " . $maskedPAN . ", contact details, and address information) will be:</p>
            <ul>
                <li>Used solely for the purposes of this engagement and compliance with legal requirements</li>
                <li>Stored securely with appropriate technical and organizational measures</li>
                <li>Not shared with third parties except as required by law or for business operations</li>
                <li>Retained only for as long as necessary for business and legal purposes</li>
            </ul>
            <p>The Rider has the right to access, correct, or request deletion of their personal data subject to legal and business requirements.</p>
        </div>
        
        <div class='term'>
            <h4>14. Governing Law and Jurisdiction</h4>
            <p>This agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising from this agreement shall be subject to the exclusive jurisdiction of the courts in <strong>Rajkot, Gujarat</strong>.</p>
            <p>Both parties irrevocably submit to the jurisdiction of these courts and waive any objection to venue or inconvenient forum.</p>
        </div>
        
        <div class='term'>
            <h4>15. Dispute Resolution and Arbitration</h4>
            <p>In the event of any dispute or difference arising out of or in connection with this agreement, the parties agree to first attempt resolution through good faith negotiations.</p>
            <p>If negotiation fails within 15 days, the dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in Rajkot, Gujarat, by a sole arbitrator mutually appointed by both parties. The decision of the arbitrator shall be final and binding.</p>
        </div>
        
        <div class='term'>
            <h4>16. Amendments and Modifications</h4>
            <p>This agreement may only be amended or modified by written agreement signed by both parties. No oral modifications or amendments shall be valid or binding.</p>
            <p>The Company reserves the right to update policies and procedures with reasonable notice to the Rider. Material changes affecting payment, working hours, or core terms will require Rider's written consent.</p>
        </div>
        
        <div class='term'>
            <h4>17. Entire Agreement and Severability</h4>
            <p><strong>Entire Agreement:</strong> This document constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements, whether written or oral.</p>
            <p><strong>Severability:</strong> If any provision of this agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
            <p><strong>Waiver:</strong> No waiver of any provision shall be deemed a waiver of any other provision or of the same provision at a later time.</p>
            <p><strong>Notices:</strong> All notices under this agreement must be in writing and delivered to the addresses provided in this document or as updated by written notice.</p>
        </div>
        
        <div class='important-box' style='margin-top: 30px;'>
            <h4>📋 CAREER PROGRESSION PATH</h4>
            <p><strong>3-Month Trial Period → Fixed-Term Contract → Permanent Employment Opportunity</strong></p>
            <p>This 3-month trial period is designed to assess mutual compatibility. Upon successful completion:</p>
            <ul>
                <li>Riders demonstrating consistent performance may be offered a fixed-term contract with enhanced benefits</li>
                <li>Exceptional performers may be considered for permanent employment with full employee benefits</li>
                <li>Performance evaluation will be based on: delivery completion rate, MDND compliance, customer feedback, and professionalism</li>
            </ul>
            <p><strong>Company reserves the right to make employment decisions based on business requirements and individual performance.</strong></p>
        </div>
        
    </div>
    
    <!-- Footer -->
    <div class='footer'>
        <h3>Shreeji Enterprise Services</h3>
        <p>
            <strong>📍 Address:</strong> 714 The Spyre 2 Sheetal Park, 150 Feet Ring Road, Rajkot, Gujarat - 360005, India<br>
            <strong>📞 Phone:</strong> +91-7016899689<br>
            <strong>✉️ Email:</strong> info@shreejientserv.in<br>
            <strong>🌐 Website:</strong> <a href='http://www.shreejientserv.in' style='color: #667eea;'>www.shreejientserv.in</a>
        </p>
        <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>
        <p style='font-size: 11px; color: #718096;'>
            <strong>LEGAL NOTICE:</strong> This email and any attachments contain confidential information intended solely for the named recipient. 
            If you are not the intended recipient, please notify the sender immediately and delete this email. 
            Unauthorized use, disclosure, or distribution is strictly prohibited.<br><br>
            
            <strong>DOCUMENT AUTHENTICITY:</strong> This is a system-generated legal document. The digital copy holds the same legal validity as a physical signed document. 
            Please retain this email for your records.<br><br>
            
            © 2024 Shreeji Enterprise Services. All rights reserved.
        </p>
    </div>
    
</body>
</html>
";

// Email headers for HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Shreeji Enterprise Services <info@shreejientserv.in>" . "\r\n";
$headers .= "Reply-To: info@shreejientserv.in" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email to rider
$riderEmailSent = mail($email, $emailSubject, $emailBody, $headers);

// Send notification to HR with different subject
$hrEmail = "hr@shreejientserv.in";
$hrSubject = "New Contract Submission - Existing Rider: " . $firstName . " " . $lastName;
$hrBody = "<div style='font-family: Arial, sans-serif; padding: 20px;'>";
$hrBody .= "<h2 style='color: #667eea;'>New Existing Rider Contract Submission</h2>";
$hrBody .= "<p><strong>Rider Name:</strong> " . $firstName . " " . $lastName . "</p>";
$hrBody .= "<p><strong>Email:</strong> " . $email . "</p>";
$hrBody .= "<p><strong>Mobile:</strong> " . $mobileNumber . "</p>";
$hrBody .= "<p><strong>Work Location:</strong> " . $workLocation . "</p>";
$hrBody .= "<p><strong>Vehicle Type:</strong> " . $vehicleType . "</p>";
$hrBody .= "<p><strong>Submission Date:</strong> " . date('d/m/Y H:i:s') . "</p>";
$hrBody .= "<hr>";
$hrBody .= "<p><em>Complete contract details have been sent to the rider's email address.</em></p>";
$hrBody .= "<p><em>Please review the submission and proceed with activation process.</em></p>";
$hrBody .= "</div>";

$hrEmailSent = mail($hrEmail, $hrSubject, $hrBody, $headers);

// Log the submission
$logEntry = date('Y-m-d H:i:s') . " | Existing Rider | " . $firstName . " " . $lastName . " | " . $email . " | " . $mobileNumber . " | Rider Email: " . ($riderEmailSent ? "Sent" : "Failed") . " | HR Email: " . ($hrEmailSent ? "Sent" : "Failed") . "\n";
file_put_contents('contract_submissions.log', $logEntry, FILE_APPEND);

// Send response
if ($riderEmailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contract accepted successfully! A confirmation email with complete terms and conditions has been sent to your email address.',
        'riderEmail' => $riderEmailSent,
        'hrNotification' => $hrEmailSent
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'There was an error sending the confirmation email. Please contact us at +91-7016899689 or info@shreejientserv.in'
    ]);
}

