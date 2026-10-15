<?php
/**
 * Join form for the static Hostinger site.
 * WhatsApp links must match src/lib/join-channels.ts.
 * Optional public/api/join-config.php (not committed) may set hcaptcha_secret.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method']);
  exit;
}

$channels = [
  'asia' => ['en' => 'Asia and the Middle East', 'ar' => 'آسيا والشرق الأوسط', 'whatsapp' => ''],
  'europe' => ['en' => 'Europe', 'ar' => 'أوروبا', 'whatsapp' => ''],
  'west-africa' => ['en' => 'West Africa', 'ar' => 'غرب أفريقيا', 'whatsapp' => ''],
  'central-africa' => ['en' => 'Central Africa', 'ar' => 'وسط أفريقيا', 'whatsapp' => ''],
  'eastern-southern-africa' => ['en' => 'Eastern and Southern Africa', 'ar' => 'شرق أفريقيا والجنوب الأفريقي', 'whatsapp' => ''],
  'latin-america' => ['en' => 'Latin America and the Caribbean', 'ar' => 'أمريكا اللاتينية والكاريبي', 'whatsapp' => ''],
  'multi' => ['en' => 'More than one region', 'ar' => 'أكثر من إقليم', 'whatsapp' => ''],
];

$config = [];
$configFile = __DIR__ . '/join-config.php';
if (is_file($configFile)) {
  $loaded = include $configFile;
  if (is_array($loaded)) $config = $loaded;
}

$secret = getenv('HCAPTCHA_SECRET') ?: '';
if (!empty($config['hcaptcha_secret'])) $secret = (string) $config['hcaptcha_secret'];
if (!empty($config['whatsapp']) && is_array($config['whatsapp'])) {
  foreach ($config['whatsapp'] as $id => $url) {
    if (isset($channels[$id]) && is_string($url)) $channels[$id]['whatsapp'] = $url;
  }
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => ['message']]);
  exit;
}

$website = trim((string) ($body['website'] ?? ''));
if ($website !== '') {
  echo json_encode(['ok' => true, 'whatsappUrl' => null]);
  exit;
}

function one_line(string $value, int $max): string {
  $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';
  $clean = str_replace(["\r", "\n"], ' ', $clean);
  return trim(mb_substr($clean, 0, $max));
}

$name = one_line((string) ($body['name'] ?? ''), 120);
$email = one_line((string) ($body['email'] ?? ''), 254);
$organisation = one_line((string) ($body['organisation'] ?? ''), 200);
$place = one_line((string) ($body['place'] ?? ''), 120);
$region = trim((string) ($body['region'] ?? ''));
$access = trim(mb_substr((string) ($body['access'] ?? ''), 0, 500));
$message = trim(mb_substr((string) ($body['message'] ?? ''), 0, 4000));
$consent = ($body['consent'] ?? false) === true;
$lang = (($body['lang'] ?? '') === 'ar') ? 'ar' : 'en';
$token = trim((string) ($body['captchaToken'] ?? ''));

$fields = [];
if ($name === '') $fields[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $fields[] = 'email';
if (!isset($channels[$region])) $fields[] = 'region';
if (mb_strlen($message) < 8) $fields[] = 'message';
if (!$consent) $fields[] = 'consent';
if ($secret !== '' && $token === '') $fields[] = 'captcha';
if ($fields) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $fields]);
  exit;
}

if ($secret !== '') {
  $verify = file_get_contents('https://api.hcaptcha.com/siteverify', false, stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
      ]),
      'timeout' => 8,
    ],
  ]));
  $captcha = json_decode($verify ?: '', true);
  if (!is_array($captcha) || empty($captcha['success'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'captcha']);
    exit;
  }
}

$label = $channels[$region][$lang];
$whatsapp = whatsapp_link((string) $channels[$region]['whatsapp']);
$staff = staff_text($name, $email, $organisation, $place, $label, $access, $message, $lang, $whatsapp);
$visitor = $lang === 'ar'
  ? visitor_ar($name, $label, $whatsapp)
  : visitor_en($name, $label, $whatsapp);
$visitorSubject = $lang === 'ar'
  ? 'استلمنا رسالتك — شبكة الاتحاد الأوروبي للشباب والسلام والأمن'
  : 'We received your message — EU YPS Network';
$staffSubject = one_line("Join request — {$name} — {$label}", 180);

$headers = "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nFrom: EU YPS Network <info@euypsnet.org>\r\n";
$staffOk = mail('info@euypsnet.org', mime_subject($staffSubject), $staff, $headers . "Cc: euypsnet@gmail.com\r\nReply-To: {$email}\r\n");
$visitorOk = mail($email, mime_subject($visitorSubject), $visitor, $headers . "Reply-To: info@euypsnet.org\r\n");

if (!$staffOk || !$visitorOk) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'send']);
  exit;
}

echo json_encode(['ok' => true, 'whatsappUrl' => $whatsapp]);

function mime_subject(string $subject): string {
  if (function_exists('mb_encode_mimeheader')) {
    return mb_encode_mimeheader($subject, 'UTF-8');
  }
  return $subject;
}

function whatsapp_link(string $raw): ?string {
  $raw = trim($raw);
  if ($raw === '') return null;
  $parts = parse_url($raw);
  if (!is_array($parts)) return null;
  $host = strtolower((string) ($parts['host'] ?? ''));
  if (($parts['scheme'] ?? '') !== 'https') return null;
  if ($host !== 'chat.whatsapp.com' && $host !== 'wa.me') return null;
  return $raw;
}

function staff_text(string $name, string $email, string $organisation, string $place, string $label, string $access, string $message, string $lang, ?string $whatsapp): string {
  $none = 'None stated';
  $group = $whatsapp
    ? "WhatsApp group included in their confirmation:\n{$whatsapp}"
    : 'No WhatsApp link is set for this region yet. Their confirmation says the regional team will send it.';
  $language = $lang === 'ar' ? 'Arabic' : 'English';
  $org = $organisation !== '' ? $organisation : $none;
  $where = $place !== '' ? $place : $none;
  $accessText = $access !== '' ? $access : $none;
  return "New join request for the EU YPS Network\n\nName: {$name}\nEmail: {$email}\nOrganisation: {$org}\nCity or country: {$where}\nRegion: {$label}\nAccessibility: {$accessText}\nLanguage: {$language}\n\nMessage:\n{$message}\n\n{$group}";
}

function visitor_en(string $name, string $label, ?string $whatsapp): string {
  $group = $whatsapp
    ? "Join the WhatsApp group for {$label}:\n{$whatsapp}"
    : "The regional team will email you the WhatsApp group link for {$label}.";
  return "Hello {$name},\n\nThank you for writing to the EU YPS Network.\nWe received your message about the {$label} region.\n\n{$group}\n\nThe network team has the same message. Reply to this email if you need a different format.\n\nEU YPS Network\ninfo@euypsnet.org";
}

function visitor_ar(string $name, string $label, ?string $whatsapp): string {
  $group = $whatsapp
    ? "مجموعة واتساب لإقليم {$label}:\n{$whatsapp}"
    : "سيرسل الفريق الإقليمي رابط مجموعة واتساب لإقليم {$label}.";
  return "مرحباً {$name}،\n\nشكراً لكتابتك إلى شبكة الاتحاد الأوروبي للشباب والسلام والأمن.\nاستلمنا رسالتك بخصوص إقليم {$label}.\n\n{$group}\n\nوصل النص نفسه إلى فريق الشبكة. رد على هذا البريد إذا احتجت صيغة مختلفة.\n\nشبكة الاتحاد الأوروبي للشباب والسلام والأمن\ninfo@euypsnet.org";
}
