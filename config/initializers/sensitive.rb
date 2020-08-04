## Sensitive Data ##

# mailer
module MAILSERVER_SETTINGS
  PORT                  = 587,                  # [accept line]
  ADDRESS               = 'your.smtp.server',   # [replace your.smtp.server]
  DOMAIN                = 'example.com',        # [replace example.com]
  USER_NAME             = 'yourmail@example.com',  # [replace yourmail@example.com]
  PASSWORD              = 'yourpassword',      # [replace yourpassword]
  AUTHENTICATION        = 'yourloginmethod',              # [replace yourloginmethod]
  ENABLE_STARTTLS_AUTO  = true                  # [accept line]
end
MAILSERVER_SETTINGS.freeze;
