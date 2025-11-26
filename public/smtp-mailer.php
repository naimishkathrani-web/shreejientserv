<?php
// smtp-mailer.php - SMTP Email handler using Hostinger's SMTP
class SMTPMailer {
    private $smtp_host = 'smtp.hostinger.com';
    private $smtp_port = 465; // SSL port
    private $smtp_user = 'info@shreejientserv.in';
    private $smtp_pass = 'Shreeji@1324';
    
    public function send($to, $subject, $body, $from_name = 'Shreeji Enterprise Services') {
        // If password not set, fall back to mail()
        if (empty($this->smtp_pass)) {
            return $this->sendWithMailFunction($to, $subject, $body);
        }
        
        return $this->sendWithSMTP($to, $subject, $body, $from_name);
    }
    
    private function sendWithMailFunction($to, $subject, $body) {
        $headers = "From: {$this->smtp_user}\r\n";
        $headers .= "Reply-To: {$this->smtp_user}\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        return mail($to, $subject, $body, $headers);
    }
    
    private function sendWithSMTP($to, $subject, $body, $from_name) {
        // Connect to SMTP server
        $socket = @fsockopen('ssl://' . $this->smtp_host, $this->smtp_port, $errno, $errstr, 30);
        
        if (!$socket) {
            error_log("SMTP connection failed: $errstr ($errno)");
            return false;
        }
        
        // Read server response
        $this->readResponse($socket);
        
        // Send EHLO
        fputs($socket, "EHLO " . $_SERVER['HTTP_HOST'] . "\r\n");
        $this->readResponse($socket);
        
        // Authenticate
        fputs($socket, "AUTH LOGIN\r\n");
        $this->readResponse($socket);
        
        fputs($socket, base64_encode($this->smtp_user) . "\r\n");
        $this->readResponse($socket);
        
        fputs($socket, base64_encode($this->smtp_pass) . "\r\n");
        $response = $this->readResponse($socket);
        
        if (strpos($response, '235') === false) {
            error_log("SMTP authentication failed");
            fclose($socket);
            return false;
        }
        
        // Send email
        fputs($socket, "MAIL FROM: <{$this->smtp_user}>\r\n");
        $this->readResponse($socket);
        
        fputs($socket, "RCPT TO: <$to>\r\n");
        $this->readResponse($socket);
        
        fputs($socket, "DATA\r\n");
        $this->readResponse($socket);
        
        // Email headers and body
        $message = "From: $from_name <{$this->smtp_user}>\r\n";
        $message .= "To: $to\r\n";
        $message .= "Subject: $subject\r\n";
        $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message .= "\r\n";
        $message .= $body;
        $message .= "\r\n.\r\n";
        
        fputs($socket, $message);
        $this->readResponse($socket);
        
        // Quit
        fputs($socket, "QUIT\r\n");
        fclose($socket);
        
        return true;
    }
    
    private function readResponse($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        return $response;
    }
}
?>
