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
  'eastern-southern-africa' => ['en' => 'Eastern and Southern Africa', 'ar' => 'شرق أفريقيا والجنوب الأفريقي', 'whatsapp' => '', 'comingSoon' => true],
  'latin-america' => ['en' => 'Latin America and the Caribbean', 'ar' => 'أمريكا اللاتينية والكاريبي', 'whatsapp' => ''],
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
$comingSoon = !empty($channels[$region]['comingSoon']);
$staff = staff_text($name, $email, $organisation, $place, $label, $access, $message, $lang, $whatsapp, $comingSoon);
$visitor = $lang === 'ar'
  ? visitor_ar($name, $label, $whatsapp, $comingSoon)
  : visitor_en($name, $label, $whatsapp, $comingSoon);
$visitorSubject = $lang === 'ar'
  ? 'استلمنا رسالتك — شبكة الاتحاد الأوروبي للشباب والسلام والأمن'
  : 'We received your message — EU YPS Network';
$staffSubject = one_line("Join request — {$name} — {$label}", 180);

$staffHtml = mail_html($staff, $label, $lang);
$visitorHtml = mail_html($visitor, $label, $lang);
$staffOk = send_html_mail('no-reply@euypsnet.org', $staffSubject, $staff, $staffHtml, "Cc: euypsnet@gmail.com\r\nReply-To: {$email}\r\n");
$visitorOk = send_html_mail($email, $visitorSubject, $visitor, $visitorHtml, "Reply-To: no-reply@euypsnet.org\r\n");

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

function send_html_mail(string $to, string $subject, string $text, string $html, string $extra): bool {
  $boundary = 'yps_' . bin2hex(random_bytes(8));
  $headers = "MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=\"{$boundary}\"\r\nFrom: EU YPS Network <no-reply@euypsnet.org>\r\n{$extra}";
  $body = "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n{$text}\r\n"
    . "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n{$html}\r\n"
    . "--{$boundary}--\r\n";
  return mail($to, mime_subject($subject), $body, $headers);
}

function mail_html(string $text, string $region, string $lang): string {
  $url = null;
  if (preg_match('#https://(?:chat\\.whatsapp\\.com|wa\\.me)/\\S+#', $text, $match)) $url = $match[0];
  $safe = htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $body = nl2br($safe, false);
  if ($url) {
    $href = htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $label = $lang === 'ar' ? "انضم إلى مجموعة {$region}" : "Join the {$region} group";
    $label = htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $button = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 8px;"><tr><td bgcolor="#25D366" style="border-radius:8px;">'
      . '<a href="' . $href . '" style="display:inline-block;padding:12px 18px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;">' . $label . '</a>'
      . '</td></tr></table><p style="margin:8px 0 0;font-size:14px;"><a href="' . $href . '" style="color:#003366;">' . $href . '</a></p>';
    $body = str_replace($href, $button, $body);
  }
  $dir = $lang === 'ar' ? 'rtl' : 'ltr';
  return '<!DOCTYPE html><html lang="' . $lang . '" dir="' . $dir . '"><body style="margin:0;background:#f8f9fa;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">'
    . '<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #c5cdd6;border-radius:12px;"><tr>'
    . '<td style="padding:28px 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1a;">' . $body . '</td>'
    . '</tr></table></td></tr></table></body></html>';
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

function staff_text(string $name, string $email, string $organisation, string $place, string $label, string $access, string $message, string $lang, ?string $whatsapp, bool $comingSoon): string {
  $none = 'None stated';
  $group = $whatsapp
    ? "WhatsApp group included in their confirmation:\n{$whatsapp}"
    : ($comingSoon
      ? 'The WhatsApp group for this region is coming soon. Their confirmation says that.'
      : 'No WhatsApp link is set for this region yet. Their confirmation says the regional team will send it.');
  $language = $lang === 'ar' ? 'Arabic' : 'English';
  $org = $organisation !== '' ? $organisation : $none;
  $where = $place !== '' ? $place : $none;
  $accessText = $access !== '' ? $access : $none;
  return "New join request for the EU YPS Network\n\nName: {$name}\nEmail: {$email}\nOrganisation: {$org}\nCity or country: {$where}\nRegion: {$label}\nAccessibility: {$accessText}\nLanguage: {$language}\n\nMessage:\n{$message}\n\n{$group}";
}

function visitor_en(string $name, string $label, ?string $whatsapp, bool $comingSoon): string {
  $group = $whatsapp
    ? "Join the WhatsApp group for {$label}:\n{$whatsapp}"
    : ($comingSoon
      ? "The WhatsApp group for {$label} is coming soon."
      : "The regional team will email you the WhatsApp group link for {$label}.");
  return "Hello {$name},\n\nThank you for writing to the EU YPS Network.\nWe received your message about the {$label} region.\n\n{$group}\n\nThe network team has the same message. Reply to this email if you need a different format.\n\nEU YPS Network\nno-reply@euypsnet.org";
}

function visitor_ar(string $name, string $label, ?string $whatsapp, bool $comingSoon): string {
  $group = $whatsapp
    ? "مجموعة واتساب لإقليم {$label}:\n{$whatsapp}"
    : ($comingSoon
      ? "مجموعة واتساب لإقليم {$label} ستتوفر قريبًا."
      : "سيرسل الفريق الإقليمي رابط مجموعة واتساب لإقليم {$label}.");
  return "مرحباً {$name}،\n\nشكراً لكتابتك إلى شبكة الاتحاد الأوروبي للشباب والسلام والأمن.\nاستلمنا رسالتك بخصوص إقليم {$label}.\n\n{$group}\n\nوصل النص نفسه إلى فريق الشبكة. رد على هذا البريد إذا احتجت صيغة مختلفة.\n\nشبكة الاتحاد الأوروبي للشباب والسلام والأمن\nno-reply@euypsnet.org";
}
