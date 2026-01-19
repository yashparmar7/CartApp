const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Cart App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent to:", to);
    return true;
  } catch (error) {
    console.error("EMAIL ERROR:", error.message);

    // ❗ don't throw — avoid blocking signup
    return false;
  }
};

const sendVerificationEmail = async (email, userName, verifyUrl) => {
  const html = `
    <div style="background:#f9fafb;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">
        <div style="background:#ef4444;padding:24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">Email Verification</h1>
        </div>

        <div style="padding:28px;color:#374151;">
          <h2 style="margin-top:0;font-size:18px;">Hey ${userName} 👋</h2>

          <p style="font-size:14px;line-height:1.6;">
            Thanks for signing up! Click below to verify your email.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${verifyUrl}"
              style="background:#ef4444;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
              Verify Email
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;">
            This link expires in <strong>24 hours</strong>.
          </p>
        </div>

        <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
          © ${new Date().getFullYear()} Cart App
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email - Cart App",
    html,
  });
};

module.exports = { sendEmail, sendVerificationEmail };
