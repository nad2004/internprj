import nodemailer from 'nodemailer';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import User from '../models/User.js';
import redisClient from '../utils/redis.js';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export async function sendMail({ to, subject, name, otp }) {
  const mailOptions = {
    from: `"Thư Viện" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: verifyEmailTemplate({ name, otp }),
  };
  await redisClient.set(`verify_otp_${to}`, otp, { EX: 300 });

  return transporter.sendMail(mailOptions);
}

export async function verifyEmail({ email, otp }) {
  const redisKey = `verify_otp_${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp || storedOtp !== otp) {
    throw new Error('OTP không đúng hoặc đã hết hạn!');
  }

  // Nếu đúng OTP, cập nhật User là verified
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User không tồn tại!');
  }
  user.verified = true;
  await user.save();

  await redisClient.del(redisKey);

  return { message: 'Xác thực email thành công', success: true };
}
