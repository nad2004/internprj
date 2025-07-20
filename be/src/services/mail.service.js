import nodemailer from 'nodemailer';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import User from '../models/User.js';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export async function sendMail({ to, subject, name, otp }) {
  const mailOptions = {
    from: `"Thư Viện: " <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: verifyEmailTemplate({ name, otp }),
  };
  return transporter.sendMail(mailOptions);
}

export async function verifyEmail({ email, otp }) {
  const user = await User.findOne({ email, otp });

  if (!user) {
    throw new Error('OTP không đúng!');
  }
  if (user.otpExpire < Date.now()) {
    throw new Error('OTP đã hết hạn!');
  }
  user.otp = null;
  user.otpExpire = null;
  user.verified = true;
  await user.save();
  const message = 'Xác thực email thành công';
  const success = true;
  return { message, success};
}
