<?php
// Check if the PHP file has syntax errors
header('Content-Type: application/json');

$phpFile = __DIR__ . '/send-contract-email.php';

if (!file_exists($phpFile)) {
    echo json_encode(['error' => 'File does not exist']);
    exit;
}

// Check syntax using php -l
exec('php -l ' . escapeshellarg($phpFile) . ' 2>&1', $output, $returnCode);

echo json_encode([
    'file' => $phpFile,
    'exists' => file_exists($phpFile),
    'syntax_check' => implode("\n", $output),
    'syntax_valid' => $returnCode === 0,
    'file_size' => filesize($phpFile),
    'last_modified' => date('Y-m-d H:i:s', filemtime($phpFile))
]);
?>
