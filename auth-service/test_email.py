from dotenv import load_dotenv
load_dotenv()

import smtplib
from email.mime.text import MIMEText
import os

print("SMTP_SERVER:", os.getenv("SMTP_SERVER"))
print("SMTP_PORT:", os.getenv("SMTP_PORT"))
print("SMTP_USER:", os.getenv("SMTP_USER"))
print("SMTP_PASSWORD:", os.getenv("SMTP_PASSWORD"))

msg = MIMEText("Test email from JnanaSetu app.")
msg['Subject'] = "Test Email"
msg['From'] = os.getenv("SMTP_USER")
msg['To'] = os.getenv("SMTP_USER")  # send to self for test

try:
    with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD"))
        server.send_message(msg)
    print("Test email sent!")
except Exception as e:
    print("Failed to send test email:", e) 