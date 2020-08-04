## Sensitive Data ##

# mailer
module MAILSERVER_SETTINGS
  PORT                  = 587,                  # [accept line]
  ADDRESS               = 'smtp.example.com',   # [replace your.smtp.server]
  DOMAIN                = 'example.com',        # [replace example.com]
  USER_NAME             = 'DAMMY@example.com',  # [replace yourmail@example.com]
  PASSWORD              = 'DAMMYPASSWORD',      # [replace yourpassword]
  AUTHENTICATION        = 'login',              # [replace yourloginmethod]
  ENABLE_STARTTLS_AUTO  = true                  # [accept line]
MAILSERVER_SETTINGS.freeze;
