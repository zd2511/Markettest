<?php
// Optional PHP contact endpoint for PHP-enabled hosting.
// Configure the recipient email and connect the form to this endpoint before production.
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

$name = trim(strip_tags($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$message = trim(strip_tags($_POST['message'] ?? ''));
$service = trim(strip_tags($_POST['service'] ?? ''));

if ($name === '' || !$email || $message === '') {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Please complete all required fields.']);
  exit;
}

// Set the real destination before enabling email delivery.
$recipient = 'REPLACE-WITH-BUSINESS-EMAIL';
if ($recipient === 'REPLACE-WITH-BUSINESS-EMAIL') {
  http_response_code(503);
  echo json_encode(['ok' => false, 'message' => 'Contact endpoint has not been configured yet.']);
  exit;
}

$subject = 'New TA Rocket Marketing enquiry';
$body = "Name: {$name}\\nEmail: {$email}\\nService: {$service}\\n\\n{$message}";
$headers = "From: website@your-domain.example\\r\\nReply-To: {$email}\\r\\n";
$sent = mail($recipient, $subject, $body, $headers);
http_response_code($sent ? 200 : 500);
echo json_encode(['ok' => $sent, 'message' => $sent ? 'Enquiry sent.' : 'Unable to send enquiry.']);
?>