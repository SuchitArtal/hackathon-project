import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_welcome_email(to_email: str, user_name: str):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = "Welcome to JnanaSetu!"

    body = f"""
    Hi {user_name},

    Welcome to JnanaSetu! We're excited to have you on board.

    Best regards,
    The JnanaSetu Team
    """
    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

def send_password_reset_email(to_email: str, reset_link: str):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = "Password Reset Request - JnanaSetu"

    # Use a public URL for the logo
    logo_url = "https://yourdomain.com/logo.png"  # <-- Replace with your actual logo URL

    body = f"""
    <html>
      <body style='font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;'>
        <div style='max-width: 400px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 24px;'>
          <div style='text-align:center;'>
            <img src='{logo_url}' alt='Jnana Setu' style='max-width: 120px; margin-bottom: 16px;'>
          </div>
          <h2 style='color: #16a34a; text-align:center;'>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <div style='text-align:center; margin: 24px 0;'>
            <a href='{reset_link}' style='display: inline-block; background: #16a34a; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;'>Reset Password</a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style='margin: 24px 0;'>
          <p style='font-size: 12px; color: #888; text-align:center;'>Need help? <a href='mailto:support@jnanasetu.com'>Contact support</a></p>
        </div>
      </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg) 