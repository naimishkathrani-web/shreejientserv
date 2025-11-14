<?php
// Minimal test version - just to verify server is working
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST requests allowed']);
    exit;
}

// Get input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Just return success for now - no email sending
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'TEST: Form data received successfully. Email functionality will be enabled after testing.',
    'debug' => [
        'name' => ($data['firstName'] ?? '') . ' ' . ($data['lastName'] ?? ''),
        'email' => $data['email'] ?? 'not provided'
    ]
]);
?>
