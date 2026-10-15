<?php
/**
 * Copy this file to public/api/join-config.php on the server.
 * Do not commit join-config.php.
 *
 * The Node / Netlify path uses environment variables instead:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, HCAPTCHA_SECRET, VITE_HCAPTCHA_SITE_KEY
 */
return [
  'hcaptcha_secret' => '',
  'whatsapp' => [
    'asia' => '',
    'europe' => '',
    'west-africa' => '',
    'central-africa' => '',
    'eastern-southern-africa' => '',
    'latin-america' => '',
  ],
];
